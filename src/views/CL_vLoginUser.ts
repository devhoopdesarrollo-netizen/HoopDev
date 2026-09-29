import Controller from "../controllers/Controller.js";
import { iLoginDTO } from "../types/types.js";

export default class Cl_vLogingUser {
    private formUserLogin: HTMLFormElement | null;
    public controller: Controller;
    constructor(Controller: Controller) {
        this.controller = Controller;
        this.formUserLogin = document.getElementById("formLogin") as HTMLFormElement | null;
        if (this.formUserLogin) {
            this.formUserLogin.addEventListener("submit", async (e) => {
                e.preventDefault()
                this.LoginUser()


            })

        }

    }
    LoginUser() {
       if(this.formUserLogin){
         const formDat = new FormData(this.formUserLogin)
        const data: iLoginDTO = {
            correo_electronico: formDat.get("login-user") as string,
            password: formDat.get("login-pass") as string,
        }
        this.controller.UserLong(data)
       }
    }
}