import Controller from "../../controllers/Controller";
import Cl_PostNewModal from "./PostModal/Cl_vPostNewModal";

export default class Cl_vUserInicio {
    private VpostModal: Cl_PostNewModal;
    private controlador: Controller;
    private nameUser: NodeListOf<HTMLElement>;
    constructor(controller: any) {
        this.controlador = controller;
        this.nameUser = document.querySelectorAll("#NameUser, .nameUser");
        this.VpostModal = new Cl_PostNewModal(this.controlador)
        const nombre = this.controlador.nameUser();
        this.nameUser.forEach(el => {
            el.textContent = nombre;
        });
    }

}
