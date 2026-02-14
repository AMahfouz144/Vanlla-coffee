
const Footer = {
    render: async () => {
        return `
            <footer class="footer">
                <div class="container footer-content">
                    <div class="footer-about">
                        <h3>About Us</h3>
                        <p>We source the finest beans from around the world to bring you the best coffee experience.</p>
                    </div>
                    <div class="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#/">Home</a></li>
                            <li><a href="#/menu">Menu</a></li>
                            <li><a href="#/about">About</a></li>
                            <li><a href="#/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-social">
                        <h3>Follow Us</h3>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-facebook"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                    <p>&copy; 2026 Vanilla Coffee. All rights reserved.</p>
                </div>
            </footer>
        `;
    }
};

export default Footer;
