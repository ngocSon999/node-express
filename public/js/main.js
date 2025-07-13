 document.getElementById("menu-toggle").addEventListener("click", function () {
          document.getElementById("sidebar").classList.toggle("d-none");
        });

        function showAlert(message, type = 'success', url = '#') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alert.role = 'alert';
        alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('#alertBox')?.appendChild(alert);

        setTimeout(function() {
            alert.remove();
            window.location.href = url;
        }, 2000)
    }

    async function logout() {
      try {
        const response = await fetch('/api/v1/auth/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();
        if (data.success === true) {
            // save token to cookie
            document.cookie = `token=; path=/; max-age=0`;
            // Redirect after login
            window.location.href = window.routes.login;
        } else {
            showAlert(data.message);
        }
      } catch (error) {
          console.error('Error:', error);
      }
    }