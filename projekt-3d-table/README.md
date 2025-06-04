# 3D Table Configurator

A simple 3D table configurator using Three.js and Node.js/Express.

## Project Setup

1.  **Initialize your project (if you haven't already):**
    Open your terminal in the `projekt-3d-table` directory and run:
    ```bash
    npm init -y
    ```
    This will create a `package.json` file.

2.  **Install dependencies:**
    Install Express and Three.js:
    ```bash
    npm install express three
    ```
    *(Note: The `main.js` currently uses Three.js from a CDN. If you wish to use the npm package, you'll need to adjust the import paths in `public/scripts/main.js` and potentially set up a build step or serve `node_modules/three` statically.)*

## Running the Application

1.  **Place your 3D Models:**
    Ensure you have valid `.glb` models in the `public/models/tops/` and `public/models/legs/` directories. The application expects:
    *   `public/models/tops/wood.glb`
    *   `public/models/tops/glass.glb`
    *   `public/models/tops/metal.glb`
    *   `public/models/legs/classic.glb`
    *   `public/models/legs/modern.glb`
    *   `public/models/legs/industrial.glb`
    (Currently, these are placeholder files. Refer to `public/models/README.txt`.)

2.  **Start the server:**
    Run the following command in your terminal from the `projekt-3d-table` directory:
    ```bash
    node server.js
    ```

3.  **Open in browser:**
    Open your web browser and navigate to:
    [http://localhost:3000](http://localhost:3000)

You should see the 3D table configurator with dropdowns to change the table's top and legs.

## Project Structure
```
projekt-3d-table/
├── package.json
├── server.js
├── README.md
└── public/
    ├── index.html
    ├── scripts/
    │   └── main.js
    ├── styles/
    │   └── style.css
    └── models/
        ├── README.txt
        ├── tops/
        │   ├── wood.glb
        │   ├── glass.glb
        │   └── metal.glb
        └── legs/
            ├── classic.glb
            ├── modern.glb
            └── industrial.glb
```
