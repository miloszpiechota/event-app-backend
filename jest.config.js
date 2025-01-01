require("dotenv").config({ path: ".env.test" });
module.exports = {
    testEnvironment: "node", // Ustawienie środowiska Node.js
    setupFiles: ["dotenv/config"], // Załaduj zmienne środowiskowe przed testami
    roots: ["./tests"], // Ścieżka do folderu z testami
    transform: {
      "^.+\\.js$": "babel-jest", // Transformacja kodu przez Babel
    },
  };
  