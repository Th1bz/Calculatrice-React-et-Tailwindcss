import { useState } from "react";
import { FaTrash } from "react-icons/fa";

function App() {
  const [display, setDisplay] = useState("0"); //Affiche le nombre actuel
  const [equation, setEquation] = useState(""); // Stock l'opération en cours
  const [history, setHistory] = useState([]); // Stocke l'historique des opérations

  // Fonction sécurisée pour évaluer les expressions mathématiques
  const safeEval = (expression) => {
    // Nettoyer l'expression pour ne garder que les chiffres et opérateurs valides
    const cleanExp = expression.replace(/[^0-9+\-*/.]|\.{2,}/g, "");

    // Vérifier si l'expression est valide
    if (!/^[0-9]+([+\-*/][0-9]+)*$/.test(cleanExp)) {
      throw new Error("Expression invalide");
    }

    // Séparer les nombres et opérateurs
    const numbers = cleanExp.split(/[+\-*/]/);
    const operators = cleanExp.split(/[0-9.]+/).filter((op) => op);

    // Vérifier la division par zéro
    if (operators.includes("/")) {
      const divIndex = operators.indexOf("/");
      if (parseFloat(numbers[divIndex + 1]) === 0) {
        throw new Error("Division par zéro");
      }
    }

    let result = parseFloat(numbers[0]);

    // Calculer le résultat
    for (let i = 0; i < operators.length; i++) {
      const nextNum = parseFloat(numbers[i + 1]);
      switch (operators[i]) {
        case "+":
          result += nextNum;
          break;
        case "-":
          result -= nextNum;
          break;
        case "*":
          result *= nextNum;
          break;
        case "/":
          result /= nextNum;
          break;
        default:
          throw new Error("Opérateur invalide");
      }
    }

    // Limiter le nombre de décimales
    return parseFloat(result.toFixed(8));
  };

  const handleNumber = (number) => {
    // Empêcher plusieurs points décimaux
    if (number === "." && display.includes(".")) {
      return;
    }

    // Limiter la longueur du nombre
    if (display.length >= 12 && display !== "0") {
      return;
    }

    if (display === "0" && number !== ".") {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  const handleOperator = (operator) => {
    // Vérifier si le nombre est valide
    if (isNaN(parseFloat(display))) {
      return;
    }

    setEquation(display + operator);
    setDisplay("0");
  };

  const calculateResult = () => {
    try {
      const fullEquation = equation + display;

      // Vérifier si l'équation est complète
      if (!equation || isNaN(parseFloat(display))) {
        return;
      }

      const result = safeEval(fullEquation);

      // Vérifier si le résultat est valide
      if (!isFinite(result)) {
        throw new Error("Résultat invalide");
      }

      setDisplay(result.toString());
      setEquation("");

      // Ajouter à l'historique avec formatage
      setHistory((prev) => [...prev, `${fullEquation} = ${result}`].slice(-5));
    } catch (error) {
      setDisplay(
        error.message === "Division par zéro" ? "Division par 0" : "Erreur"
      );
      setEquation("");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setEquation("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Calculatrice avec React, Vite.JS et Tailwindcss
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-center lg:items-start">
        {/* Historique */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Historique</h2>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-1 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <FaTrash className="w-4 h-4" />
              <span>Effacer</span>
            </button>
          </div>
          {history.length === 0 ? (
            <p className="text-gray-500 italic">Aucune opération</p>
          ) : (
            <ul className="space-y-2">
              {history.map((operation, index) => (
                <li key={index} className="text-gray-600 border-b pb-1">
                  {operation}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Calculatrice */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[320px]">
          <div className="bg-gray-200 p-4 rounded mb-4">
            <div className="text-gray-500 text-sm h-6 overflow-x-auto whitespace-nowrap">
              {equation}
            </div>
            <div className="text-right text-2xl font-bold overflow-x-auto">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={clearDisplay}
              className="col-span-2 p-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              AC
            </button>
            <button
              onClick={() => handleOperator("/")}
              className="p-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              ÷
            </button>
            <button
              onClick={() => handleOperator("*")}
              className="p-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              ×
            </button>

            <button
              onClick={() => handleNumber("7")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              7
            </button>
            <button
              onClick={() => handleNumber("8")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              8
            </button>
            <button
              onClick={() => handleNumber("9")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              9
            </button>
            <button
              onClick={() => handleOperator("-")}
              className="p-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              -
            </button>

            <button
              onClick={() => handleNumber("4")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              4
            </button>
            <button
              onClick={() => handleNumber("5")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              5
            </button>
            <button
              onClick={() => handleNumber("6")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              6
            </button>
            <button
              onClick={() => handleOperator("+")}
              className="p-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              +
            </button>

            <button
              onClick={() => handleNumber("1")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              1
            </button>
            <button
              onClick={() => handleNumber("2")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              2
            </button>
            <button
              onClick={() => handleNumber("3")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              3
            </button>
            <button
              onClick={calculateResult}
              className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 row-span-2"
            >
              =
            </button>

            <button
              onClick={() => handleNumber("0")}
              className="col-span-2 p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              0
            </button>
            <button
              onClick={() => handleNumber(".")}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              .
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
