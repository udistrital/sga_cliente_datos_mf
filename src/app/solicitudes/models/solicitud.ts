export interface PutSolicitudNombre{
    DatosAnteriores: {
        ApellidoActual: string;
        NombreActual: string;
    };
    DatosNuevos: {
        ApellidoNuevo: string;
        NombreNuevo: string;
    };
    DocumentoId: number;
}

export interface PutSolicitudIdentificacion{
    DatosAnteriores: {
        FechaExpedicionActual: string
        NumeroActual: string;
        TipoDocumentoActual: {
            Id: number;
            Nombre: string;
        }
    };
    DatosNuevos: {
        FechaExpedicionNuevo: string;
        NumeroNuevo: string;
        TipoDocumentoNuevo:{
            Id: number;
            Nombre: string;
        }
    };
    DocumentoId: number;
}