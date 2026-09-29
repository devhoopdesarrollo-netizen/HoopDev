import Controller from "../../../controllers/Controller.js";

export default class Cl_PostNewModal{
    private form:HTMLFormElement;
    private ImagenTem:HTMLElement;
    public controlador:Controller | null = null;
    constructor(controller:any){
        this.form = document.getElementById("formNewPost") as HTMLFormElement;  
        this.ImagenTem = document.getElementById("imagenDefault") as HTMLElement;
        this.controlador = controller;
      
    }
    PlantillaText(){
        
    }
}