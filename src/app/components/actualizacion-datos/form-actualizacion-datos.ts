export const ACTUALIZAR_DATOS = {
  titulo: 'solicitud_encabezado',
  tipo_formulario: 'mini',
  modelo: 'solicitudDatos',
  btn: 'Enviar',
  campos: [
    {
      etiqueta: 'input',
      tipo: 'text',
      nombre: 'FechaSolicitud',
      claseGrid: 'col-12 col-sm-6',
      label_i18n: 'fecha',
      deshabilitar: true,
      requerido: true,
      key: 'FechaSolicitud',
    },
    {
      etiqueta: 'div',
      claseGrid: 'offset-sm-6',
    },
    {
      etiqueta: 'select',
      tipo: 'text',
      nombre: 'TipoDocumentoActual',
      claseGrid: 'col-12 col-sm-6',
      label_i18n: 'documento_actual',
      deshabilitar: true,
      requerido: true,
      opciones: [],
      key: 'Nombre',
    },
    {
      etiqueta: 'input',
      tipo: 'text',
      nombre: 'NumeroActual',
      claseGrid: 'col-12 col-sm-6',
      label_i18n: 'numero_actual',
      requerido: true,
      deshabilitar: true,
      key: 'Numero',
    },
    {
      etiqueta: 'input',
      tipo: 'text',
      nombre: 'FechaExpedicionActual',
      claseGrid: 'col-12 col-sm-6',
      label_i18n: 'expedicion_actual',
      requerido: true,
      deshabilitar: true,
      key: 'FechaExpedicion',
    },
    {
      etiqueta: 'div',
      claseGrid: 'offset-sm-6',
    },
    {
      etiqueta: 'select',
      tipo: 'text',
      nombre: 'TipoDocumentoNuevo',
      claseGrid: 'col-12 col-sm-6',
      label_i18n: 'documento_nuevo',
      requerido: true,
      opciones: [],
      key: 'Nombre',
    },
    {
      etiqueta: 'input',
      tipo: 'text',
      nombre: 'NumeroNuevo',
      claseGrid: 'col-12 col-sm-6',
      label_i18n: 'numero_nuevo',
      requerido: true,
    },
    {
      etiqueta: 'input',
      tipo: 'date',
      nombre: 'FechaExpedicionNuevo',
      claseGrid: 'col-12 col-sm-6',
      label_i18n: 'expedicion_nuevo',
      requerido: true,
    },
    {
      etiqueta: 'div',
      claseGrid: 'offset-sm-6',
    },
    {
      etiqueta: 'file',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      clase: 'form-control',
      nombre: 'Documento',
      label_i18n: 'soporte_id',
      placeholder_i18n: 'soporte_documento',
      requerido: true,
      tipo: 'pdf',
      tipoDocumento: 25,
      formatos: 'pdf',
      url: '',
      tamanoMaximo: 2,
    },
    {
      etiqueta: 'button',
      claseGrid: 'col-12 col-sm-6',
      nombre: 'ButonEditar',
      id: 'noMostrar',
      tipo: 'mat-button',
      label_i18n: 'responder_solicitud',
      label_i18n_estudiante: 'modificar_solicitud',
    },
  ],
}
