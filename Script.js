let pacientes = [];
let indiceEditar = -1;

function registrarPaciente() {
    const nombre = document.getElementById('nombre').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const edad = document.getElementById('edad').value.trim();
    const motivo = document.getElementById('motivo').value.trim();
    // Nuevo campo: Dirección
    const direccion = document.getElementById('direccion').value.trim(); 

    if (nombre === '' || dni === '' || edad === '' || motivo === '' || direccion === '') {
        alert("Por favor, complete todos los campos, incluida la Dirección.");
        return;
    }
    if (dni.length !== 8 || isNaN(dni)) {
        alert("El DNI debe tener 8 dígitos numéricos.");
        return;
    }
    if (parseInt(edad) <= 0) {
        alert("La edad debe ser un número positivo.");
        return;
    }

    // El objeto paciente ahora incluye la dirección
    const paciente = { nombre, dni, edad, motivo, direccion }; 
    
    if (indiceEditar === -1) {
        // Validación de DNI duplicado (mejora esencial)
        if (pacientes.some(p => p.dni === dni)) {
            alert(`⚠️ Error: El paciente con DNI ${dni} ya está registrado.`);
            return;
        }
        pacientes.push(paciente);
    } else {
        pacientes[indiceEditar] = paciente;
        indiceEditar = -1;
        document.getElementById('cancelarBtn').classList.add('d-none');
    }
    
    limpiarFormulario();
    mostrarPacientes();
    guardarPacientes(); // Implementación de Local Storage si la agregas
}

function mostrarPacientes() {
    const tabla = document.getElementById('tablaPacientes');
    tabla.innerHTML = '';

    if (pacientes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay pacientes registrados aún.</td></tr>';
        return;
    }
    
    pacientes.forEach((p, i) => {
        tabla.innerHTML += `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.dni}</td>
            <td>${p.edad}</td>
            <td>${p.motivo}</td>
            <td>${p.direccion}</td> <td>
                <button class="btn btn-info btn-sm me-2" onclick="editarPaciente(${i})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${i})">Eliminar</button>
            </td>
        </tr>`;
    });
}

function editarPaciente(i) {
    const p = pacientes[i];
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('dni').value = p.dni;
    document.getElementById('edad').value = p.edad;
    document.getElementById('motivo').value = p.motivo;
    document.getElementById('direccion').value = p.direccion; // Cargar dirección
    
    // Opcional: Deshabilitar DNI para mantener la clave
    document.getElementById('dni').disabled = true;
    document.querySelector('#formularioPaciente button.btn-success').textContent = 'Guardar Cambios';

    indiceEditar = i;
    document.getElementById('cancelarBtn').classList.remove('d-none');
}

function eliminarPaciente(i) {
    if (confirm("¿Deseas eliminar este registro?")) {
        pacientes.splice(i, 1);
        mostrarPacientes();
        guardarPacientes(); // Si usas Local Storage
    }
}

function cancelarEdicion() {
    limpiarFormulario();
    indiceEditar = -1;
    document.getElementById('dni').disabled = false; // Habilitar DNI
    document.querySelector('#formularioPaciente button.btn-success').textContent = 'Registrar';
    document.getElementById('cancelarBtn').classList.add('d-none');
}

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('motivo').value = '';
    document.getElementById('direccion').value = ''; // Limpiar dirección
}

// **RECUERDA:** Agregar estas funciones para la persistencia de datos (Local Storage)
function cargarPacientes() {
    const data = localStorage.getItem('pacientesClinica');
    return data ? JSON.parse(data) : [];
}

function guardarPacientes() {
    localStorage.setItem('pacientesClinica', JSON.stringify(pacientes));
}

// Inicializar la carga de datos al iniciar
pacientes = cargarPacientes();
mostrarPacientes();