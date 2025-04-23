# Aplikacja rezerwacyjna

Prosta aplikacja do rezerwacji pokojów w hotelu.

# Wymagania
- PostgreSQL
- node i npm

# Uruchamianie projektu (do testów)

## Podczas pierwszego uruchamiania
1. Pobrać wymagane paczki używając komendy:
    ```bash
    npm i
    ```
2. Wypełnić .env używając .env.example
3. Zaimportować tabelki do bazy danych:
    ```bash
    npm start db:push
    ```
    * Dodać przykładowe dane z pliku example_data.sql (opcjonalnie)
4. Włączyć projekt:
    ```bash
    npm start dev
    ```

