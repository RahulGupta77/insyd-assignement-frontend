const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} Insyd. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://www.rahulgupta.tech"
              target="_blank"
              className="hover:text-purple-400"
            >
              My Portfolio
            </a>
            <a href="#" className="hover:text-purple-400">
              Github Repository
            </a>
            <a href="#" className="hover:text-purple-400">
              System Design Doc
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
