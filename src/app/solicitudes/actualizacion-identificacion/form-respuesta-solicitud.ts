export const RESPUESTA_SOLICITUD = {
  titulo: 'solicitud_respuesta',
  tipo_formulario: 'mini',
  modelo: 'solicitudRespuesta',
  btn: 'Enviar respuesta',
  campos: [
    {
      etiqueta: 'textarea',
      tipo: 'textarea',
      nombre: 'Observacion',
      claseGrid: 'form-col2',
      label_i18n: 'observacion',
      requerido: false,
      key: 'Valor',
    },
    {
      etiqueta: 'checkboxcombo',
      tipo: 'checkboxcombo',
      opciones: {
        Aprobado: 'Aprobado',
        Rechazado: 'Rechazado',
        Rectificar: 'Rectificar',
      },
      nombre: 'Estado',
      claseGrid: '',
      label_i18n: 'doc_valido',
      requerido: false,
      key: 'Valor',
    },
  ],
};

export const ESTADOSMAP = {
  "Acta aprobada": 'Aprobado',
  "Solicitud rechazada": 'Rechazado',
  "Rectificar": 'Rectificar',
};
