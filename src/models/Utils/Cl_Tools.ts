export default class Cl_Tools {
    TimePost(fechaPost: Date): string {
        const ahora = new Date();
        const fecha_psot = new Date(fechaPost);

        const diferencia = ahora.getTime() - fecha_psot.getTime();
        const segundos = Math.floor(diferencia / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);

        if (segundos < 60) {
            return "Hace unos segundos";
        } else if (minutos < 60) {
            return `Hace ${minutos} minutos`;
        } else if (horas < 24) {
            return `Hace ${horas} horas`;
        } if (dias < 7) {
            return `Publicado hace  ${dias} dia`;

        } else {
            return `Publicado el ${fecha_psot.toLocaleDateString()}`;
        }

    }
    //revisar esta funcion
    conteadorLikes(likes: number, estado: boolean): number {
        if (likes == 0 && estado == false) {
            return 1
        } else if (estado == true) {
            return (likes - 1)
        } else {
            return (likes + 1)
        }
    }
    //
    ConversorTimes(horas: string) {
        const [horasStr, minutoStr] = horas.split(":");
        let hora = parseInt(horasStr, 10);

        const ampm = hora >= 12 ? "PM" : "AM";
        hora = hora % 12;
        hora = hora ? hora : 12;


        const minutos = minutoStr ? minutoStr : "00";
        return `${hora}:${minutos} ${ampm}`;
    }

}