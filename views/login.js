import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';

const Login = {
    render: async () => {
        const navbar = await Navbar.render();
        const footer = await Footer.render();

        return `
            ${navbar}
            <div class="container flex items-center justify-between" style="min-height: 60vh; flex-direction: column;">
                <div style="max-width: 400px; width: 100%; margin: 2rem auto; padding: 2rem; background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow);">
                    <h2 class="text-center mb-4" style="color: var(--primary-color);">Login</h2>
                    <form id="login-form">
                        <div class="mb-4">
                            <label for="email" style="display: block; margin-bottom: 0.5rem;">Email</label>
                            <input type="email" id="email" style="width: 100%; padding: 0.8rem; border: 1px solid var(--gray-light); border-radius: var(--radius);" required>
                        </div>
                        <div class="mb-4">
                            <label for="password" style="display: block; margin-bottom: 0.5rem;">Password</label>
                            <input type="password" id="password" style="width: 100%; padding: 0.8rem; border: 1px solid var(--gray-light); border-radius: var(--radius);" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>
                    <p class="text-center mt-4">Don't have an account? <a href="#/register" style="color: var(--secondary-color);">Register</a></p>
                </div>
            </div>
            ${footer}
        `;
    },

    afterRender: async () => {
        await Navbar.afterRender();
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login successful! Redirecting...');
            window.location.hash = '/';
        });
    }
};

export default Login;
