document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario-afiliacion");
    const tablaGustos = document.getElementById("tabla-gustos");
    const mensajeGuardar = document.getElementById("mensaje-guardar");
    const btnAceptar = document.querySelector(".btn-aceptar");
    const btnCancelar = document.querySelector(".btn-cancelar");
    const mensajeError = document.querySelector(".mensaje-error");
    const btnEnviarGusto = document.getElementById("btn-enviar-gusto");

    let filaEnEdicion = null;

    // Ocultar mensaje de guardar cambios y botones de aceptar/cancelar al cargar la página
    mensajeGuardar.style.display = "none";
    btnAceptar.style.display = "none";
    btnCancelar.style.display = "none";

    // Función para agregar una fila a la tabla de gustos
    function agregarFila(gusto) {
        const fila = `<tr>
                        <td>${gusto}</td>
                        <td contenteditable="true">0</td>
                        <td><button class="btn-editar">Editar</button></td>
                     </tr>`;
        tablaGustos.querySelector("tbody").insertAdjacentHTML('beforeend', fila);
    }

    // Evento cuando se envía el formulario
    btnEnviarGusto.addEventListener("click", function (event) {
        event.preventDefault();
        const gusto = formulario.gusto.value.trim();
        if (gusto === "") return;
        agregarFila(gusto);
        formulario.gusto.value = ""; // Limpiar el campo de gusto
        // Ocultar mensaje de guardar cambios
        mensajeGuardar.style.display = "none";
    });

    // Evento al hacer clic en un botón de editar
    tablaGustos.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-editar")) {
            const btnEditar = event.target;
            const fila = btnEditar.closest("tr");
            const porcentaje = fila.querySelector("td:nth-child(2)");
            if (filaEnEdicion && fila !== filaEnEdicion) {
                mensajeError.textContent = "Solo se puede editar una línea. Recargue la página para poder editar otra.";
                mensajeError.style.display = "block";
                return;
            }
            mensajeError.style.display = "none";
            filaEnEdicion = fila;
            if (btnEditar.classList.contains("editando")) {
                // Terminar edición
                btnEditar.textContent = "Editar";
                btnEditar.classList.remove("editando");
                porcentaje.contentEditable = "false";
                porcentaje.style.backgroundColor = "transparent";
                // Ocultar mensaje y botones
                mensajeGuardar.style.display = "none";
                btnAceptar.style.display = "none";
                btnCancelar.style.display = "none";
            } else {
                // Comenzar edición
                btnEditar.textContent = "En edición";
                btnEditar.classList.add("editando");
                porcentaje.contentEditable = "true";
                porcentaje.style.backgroundColor = "#f2f2f2";
                // Mostrar mensaje y botones
                mensajeGuardar.style.display = "block";
                btnAceptar.style.display = "inline-block";
                btnCancelar.style.display = "inline-block";
            }
        }
    });

    // Evento al hacer clic en Aceptar
    btnAceptar.addEventListener("click", function () {
        if (!filaEnEdicion) return;
        const porcentaje = filaEnEdicion.querySelector("td:nth-child(2)").textContent;
        const originalGusto = filaEnEdicion.querySelector("td:first-child").textContent;
        const nuevoPorcentaje = encodeURIComponent(porcentaje.trim());
        const url = `Resultado.html?nombre=${encodeURIComponent(formulario.nombre.value)}&email=${encodeURIComponent(formulario.email.value)}&gusto=${encodeURIComponent(originalGusto)}&porc=${nuevoPorcentaje}`;
        console.log("URL de redirección:", url); // Agregamos un mensaje de registro para verificar la URL
        window.location.href = url;
    });

    // Evento al hacer clic en Cancelar
    btnCancelar.addEventListener("click", function () {
        // Restaurar porcentajes
        const porcentajes = Array.from(tablaGustos.querySelectorAll("td:nth-child(2)"));
        porcentajes.forEach(porcentaje => {
            porcentaje.textContent = "0";
        });
        // Limpiar el formulario
        document.getElementById("formulario-afiliacion").reset();
        // Eliminar todas las filas de la tabla, excepto la fila de encabezado (thead)
        const tbody = tablaGustos.querySelector("tbody");
        tbody.innerHTML = ""; // Elimina todas las filas de la tabla
        // Ocultar mensaje de guardar cambios
        mensajeGuardar.style.display = "none";
        filaEnEdicion = null;
        //ocultar botones
        btnAceptar.style.display = "none";
        btnCancelar.style.display = "none";
    });
});
