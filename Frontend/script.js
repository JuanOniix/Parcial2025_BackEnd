document.addEventListener('DOMContentLoaded', () => {
    loadRoles();
    loadUsers();
});

async function loadRoles() {
    try {
        const response = await fetch('/api/roles');
        const roles = await response.json();

        const roleSelect = document.getElementById('userRole');
        roleSelect.innerHTML = '<option value="">Seleccione un rol</option>';
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            roleSelect.appendChild(option);
        });

        const rolesList = document.getElementById('rolesList');
        rolesList.innerHTML = '';
        roles.forEach(role => {
            const li = document.createElement('li');
            li.textContent = `• ${role.name}`;
            rolesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error cargando roles:', error);
    }
    li.innerHTML = `
  <span>${role.name}</span>
  ${role.description ? `<small>${role.description}</small>` : ''}
`;
}

async function loadUsers() {

    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `• ${user.first_name} ${user.last_name}, ${user.role_name}`;
            usersList.appendChild(li);
        });
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
    li.innerHTML = `
  <span>${user.first_name} ${user.last_name}</span>
  <span class="role-badge">${user.role_name}</span>
`;
}

async function addRole() {
    const name = document.getElementById('roleName').value;
    const desc = document.getElementById('roleDesc').value;

    if (!name) {
        alert('El nombre del rol es requerido');
        return;
    }

    try {
        await fetch('/api/roles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description: desc })
        });

        document.getElementById('roleName').value = '';
        document.getElementById('roleDesc').value = '';
        loadRoles();
    } catch (error) {
        console.error('Error agregando rol:', error);
    }
}

async function addUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const identification = document.getElementById('identification').value;
    const email = document.getElementById('email').value;
    const roleId = document.getElementById('userRole').value;

    if (!firstName || !lastName || !identification || !email || !roleId) {
        alert('Todos los campos son requeridos');
        return;
    }

    try {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName,
                lastName,
                identification,
                email,
                roleId
            })
        });

        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('identification').value = '';
        document.getElementById('email').value = '';
        document.getElementById('userRole').value = '';

        loadUsers();
    } catch (error) {
        console.error('Error agregando usuario:', error);
    }

}
