// --- Variables Globales ---
let pacientes = cargarPacientes(); // Inicializa el array con datos de Local Storage
let indiceEditar = -1;

// --- Funciones de Persistencia (Local Storage) ---
function cargarPacientes() {
    const data = localStorage.getItem('pacientesClinica');
    return data ? JSON.parse(data) : [];
}

function guardarPacientes() {
    localStorage.setItem('pacientesClinica', JSON.stringify(pacientes));
}

// --- Función Principal de Registro/Edición ---
function registrarPaciente() {
    const nombre = document.getElementById('nombre').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const edad = document.getElementById('edad').value.trim();
    const motivo = document.getElementById('motivo').value.trim();
    const direccion = document.getElementById('direccion').value.trim(); 

    // Validación Básica
    if (nombre === '' || dni === '' || edad === '' || motivo === '' || direccion === '') {
        alert("Por favor, complete todos los campos.");
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

    const paciente = { nombre, dni, edad, motivo, direccion }; 
    
    if (indiceEditar === -1) {
        // Modo Registro: Validación de DNI duplicado
        if (pacientes.some(p => p.dni === dni)) {
            alert(`⚠️ Error: El paciente con DNI ${dni} ya está registrado.`);
            return;
        }
        pacientes.push(paciente);
        alert('Paciente registrado con éxito.');
    } else {
        // Modo Edición
        // Asegurar que no se duplique DNI al editar otro registro
        const dniDuplicado = pacientes.some((p, i) => p.dni === dni && i !== indiceEditar);
        if (dniDuplicado) {
             alert(`⚠️ Error: El DNI ${dni} ya pertenece a otro paciente.`);
             return;
        }
        
        pacientes[indiceEditar] = paciente;
        cancelarEdicion(); // Resetear la interfaz después de guardar
        alert('Paciente actualizado con éxito.');
    }
    
    limpiarFormulario();
    mostrarPacientes();
    guardarPacientes(); // Guardar en Local Storage
}

// --- Función para Mostrar Pacientes ---
function mostrarPacientes() {
    const tabla = document.getElementById('tablaPacientes');
    tabla.innerHTML = '';

    if (pacientes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay pacientes registrados aún.</td></tr>';
        return;
    }
    
    pacientes.forEach((p, i) => {
        // Se usa `p.direccion` para mostrar el nuevo campo
        tabla.innerHTML += `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.dni}</td>
            <td>${p.edad}</td>
            <td>${p.motivo}</td>
            <td>${p.direccion}</td> 
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editarPaciente(${i})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${i})">Eliminar</button>
            </td>
        </tr>`;
    });
}

// --- Funciones de Edición y Eliminación ---

function editarPaciente(i) {
    const p = pacientes[i];
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('dni').value = p.dni;
    document.getElementById('edad').value = p.edad;
    document.getElementById('motivo').value = p.motivo;
    document.getElementById('direccion').value = p.direccion;
    
    document.getElementById('dni').disabled = true; // Deshabilitar DNI en edición
    document.querySelector('#formularioPaciente button.btn-success').textContent = 'Guardar Cambios';

    indiceEditar = i;
    document.getElementById('cancelarBtn').classList.remove('d-none');
}

function eliminarPaciente(i) {
    if (confirm("¿Deseas eliminar este registro?")) {
        pacientes.splice(i, 1);
        // Si eliminamos el registro que se estaba editando, cancelamos la edición.
        if (indiceEditar === i) {
            cancelarEdicion();
        }
        mostrarPacientes();
        guardarPacientes();
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
    document.getElementById('formularioPaciente').reset();
}

// --- Inicialización al Cargar la Página ---
document.addEventListener('DOMContentLoaded', mostrarPacientes);
