import { iRecursos } from "../../../types/types.js"

export default class Cl_mRecursosModel {
    private _nameFiles: string = ""
    private _description: string = ""
    private _programa: string = ""
    private _documentDirecciontion: string = ""

    constructor({ nameFiles, description, programa, documentDirecciontion }: iRecursos) {
        this.nameFiles = nameFiles;
        this.description = description;
        this.programa = programa;
        this.documentDirecciontion = documentDirecciontion;
    }
    set nameFiles(nameFiles: string) {
        this._nameFiles = nameFiles.trim().toLocaleUpperCase()

    }
    get nameFiles(): string {
        return this._nameFiles
    }
    set description(description: string) {
        this._description = description.trim().toLocaleUpperCase()

    }
    get description(): string {
        return this._description
    }
    set programa(programa: string) {
        this._programa = programa.trim()

    }
    get programa(): string {
        return this._programa
    }
    set documentDirecciontion(documentDirecciontion: string) {
        this._documentDirecciontion = documentDirecciontion

    }
    get documentDirecciontion(): string {
        return this._documentDirecciontion
    }
    toJSON(): iRecursos {
        return {
            nameFiles: this.nameFiles,
            description: this.description,
            programa: this.programa,
            documentDirecciontion: this.documentDirecciontion,
        }
    }

}