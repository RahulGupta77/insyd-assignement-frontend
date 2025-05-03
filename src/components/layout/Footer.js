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
            <a
              href="https://github.com/RahulGupta77/insyd-assignement-frontend"
              className="hover:text-purple-400"
              target="_blank"
            >
              Github Repository
            </a>
            <a
              target="_blank"
              href="https://www.notion.so/Insyd-Notification-System-Design-Document-1e8323f2c3a880c19158d88481442889?pvs=4"
              className="hover:text-purple-400"
            >
              System Design Doc
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
