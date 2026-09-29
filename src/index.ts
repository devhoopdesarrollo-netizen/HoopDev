import Controller from "./controllers/Controller.js";

export default class Cl_index {
    public controller: Controller;

    constructor() {
        this.controller = new Controller();
        console.log("🚀 Aplicación HoopPeru inicializada.");
    }
}

// Inicializar la aplicación cuando el DOM esté listo
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new Cl_index();
    });
}