import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import api from '../js/api.js';
import store from '../js/state.js';

const Register = {
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
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <h2 class="auth-title">Create Account</h2>
                        <p class="auth-subtitle">Join us for the best coffee experience</p>
                    </div>

                    <!-- Error message -->
                    <p class="auth-error" id="register-error" style="display:none;"></p>

                    <!-- Register Form -->
                    <form id="register-form" class="auth-form">
                        <div class="input-group">
                            <label for="reg-name">Full Name</label>
                            <div class="input-wrapper">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" id="reg-name" placeholder="John Doe" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="reg-email">Email Address</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input type="email" id="reg-email" placeholder="you@example.com" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="reg-password">Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="reg-password" placeholder="••••••••" required minlength="6">
                                <button type="button" class="toggle-password" data-target="reg-password" aria-label="Toggle password visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="password-strength" id="password-strength">
                                <div class="strength-bar"></div>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="reg-confirm-password">Confirm Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-shield-alt input-icon"></i>
                                <input type="password" id="reg-confirm-password" placeholder="••••••••" required minlength="6">
                                <button type="button" class="toggle-password" data-target="reg-confirm-password" aria-label="Toggle password visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <p class="field-error" id="confirm-error"></p>
                        </div>

                        <div class="auth-options">
                            <label class="remember-me">
                                <input type="checkbox" id="agree-terms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#" class="terms-link">Terms & Conditions</a>
                            </label>
                        </div>

                        <button type="submit" class="auth-btn" id="register-btn">
                            <span class="btn-text">Create Account</span>
                            <i class="fas fa-arrow-right btn-arrow"></i>
                        </button>
                    </form>

                    <!-- Divider -->
                    <div class="auth-divider">
                        <span>or sign up with</span>
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
                        Already have an account? <a href="#/login">Sign In</a>
                    </p>
                </div>
            </section>
            ${footer}
        `;
    },

    afterRender: async () => {
        await Navbar.afterRender();

        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = btn.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });

        // Password strength indicator
        const passwordInput = document.getElementById('reg-password');
        const strengthBar = document.querySelector('.strength-bar');
        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', () => {
                const val = passwordInput.value;
                let strength = 0;
                if (val.length >= 6) strength++;
                if (val.length >= 10) strength++;
                if (/[A-Z]/.test(val)) strength++;
                if (/[0-9]/.test(val)) strength++;
                if (/[^A-Za-z0-9]/.test(val)) strength++;

                const percent = (strength / 5) * 100;
                strengthBar.style.width = percent + '%';
                strengthBar.className = 'strength-bar';
                if (strength <= 1) strengthBar.classList.add('weak');
                else if (strength <= 3) strengthBar.classList.add('medium');
                else strengthBar.classList.add('strong');
            });
        }

        // Confirm password validation
        const confirmInput = document.getElementById('reg-confirm-password');
        const confirmError = document.getElementById('confirm-error');
        if (confirmInput) {
            confirmInput.addEventListener('input', () => {
                if (confirmInput.value && confirmInput.value !== passwordInput.value) {
                    confirmError.textContent = 'Passwords do not match';
                    confirmError.style.display = 'block';
                } else {
                    confirmError.textContent = '';
                    confirmError.style.display = 'none';
                }
            });
        }

        // Form submission — calls the real API
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            if (passwordInput.value !== confirmInput.value) {
                confirmError.textContent = 'Passwords do not match';
                confirmError.style.display = 'block';
                confirmInput.focus();
                return;
            }

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = passwordInput.value;
            const btn = document.getElementById('register-btn');
            const errorEl = document.getElementById('register-error');

            // Hide previous error
            errorEl.style.display = 'none';

            // Show loading state
            btn.classList.add('loading');
            btn.innerHTML = '<span class="spinner"></span>';

            try {
                const { user } = await api.register(name, email, password);

                // Auto-login: set user in global store
                store.setState({ user });

                btn.classList.remove('loading');
                btn.innerHTML = '<span class="btn-text">Create Account</span><i class="fas fa-arrow-right btn-arrow"></i>';

                // Redirect to home
                window.location.hash = '/';
            } catch (err) {
                btn.classList.remove('loading');
                btn.innerHTML = '<span class="btn-text">Create Account</span><i class="fas fa-arrow-right btn-arrow"></i>';
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

export default Register;

