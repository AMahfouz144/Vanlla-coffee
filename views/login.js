import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import api from '../js/api.js';
import store from '../js/state.js';

const Login = {
    render: async () => {
        const navbar = await Navbar.render();
        const footer = await Footer.render();

        return `
            ${navbar}
            <section class="auth-section">
                <div class="auth-card">
                    <!-- Decorative header -->
                    <div class="auth-header">
                        <div class="auth-icon">
                            <i class="fas fa-coffee"></i>
                        </div>
                        <h2 class="auth-title">Welcome Back</h2>
                        <p class="auth-subtitle">Sign in to your account</p>
                    </div>

                    <!-- Error message -->
                    <p class="auth-error" id="login-error" style="display:none;"></p>

                    <!-- Login Form -->
                    <form id="login-form" class="auth-form">
                        <div class="input-group">
                            <label for="login-email">Email Address</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input type="email" id="login-email" placeholder="you@example.com" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="login-password">Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="login-password" placeholder="••••••••" required>
                                <button type="button" class="toggle-password" aria-label="Toggle password visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="auth-options">
                            <label class="remember-me">
                                <input type="checkbox" id="remember-me">
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" class="forgot-link">Forgot password?</a>
                        </div>

                        <button type="submit" class="auth-btn" id="login-btn">
                            <span class="btn-text">Sign In</span>
                            <i class="fas fa-arrow-right btn-arrow"></i>
                        </button>
                    </form>

                    <!-- Divider -->
                    <div class="auth-divider">
                        <span>or</span>
                    </div>

                    <!-- Social Login -->
                    <div class="social-login">
                        <button class="social-btn google-btn" type="button">
                            <i class="fab fa-google"></i>
                            <span>Google</span>
                        </button>
                        <button class="social-btn facebook-btn" type="button">
                            <i class="fab fa-facebook-f"></i>
                            <span>Facebook</span>
                        </button>
                    </div>

                    <!-- Toggle Link -->
                    <p class="auth-toggle">
                        Don't have an account? <a href="#/register">Sign Up</a>
                    </p>
                </div>
            </section>
            ${footer}
        `;
    },

    afterRender: async () => {
        await Navbar.afterRender();

        // Toggle password visibility
        const toggleBtn = document.querySelector('.toggle-password');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const input = document.getElementById('login-password');
                const icon = toggleBtn.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        }

        // Form submission — calls the real API
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const btn = document.getElementById('login-btn');
            const errorEl = document.getElementById('login-error');

            // Hide previous error
            errorEl.style.display = 'none';

            // Show loading state
            btn.classList.add('loading');
            btn.innerHTML = '<span class="spinner"></span>';

            try {
                const { user } = await api.login(email, password);

                // Update global store with logged-in user
                store.setState({ user });

                btn.classList.remove('loading');
                btn.innerHTML = '<span class="btn-text">Sign In</span><i class="fas fa-arrow-right btn-arrow"></i>';

                // Redirect to home
                window.location.hash = '/';
            } catch (err) {
                btn.classList.remove('loading');
                btn.innerHTML = '<span class="btn-text">Sign In</span><i class="fas fa-arrow-right btn-arrow"></i>';
                errorEl.textContent = err.message;
                errorEl.style.display = 'block';
            }
        });

        // Animate card on load
        const card = document.querySelector('.auth-card');
        if (card) {
            card.classList.add('animate-in');
        }
    }
};

export default Login;

