import { useRef } from 'react';
import { useClickAway } from 'react-use';
import Button from './Button';

const PublishedModal = ({ closeModal }: { closeModal: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickAway(modalRef, () => {
    closeModal();
  });

  return (
    <div className="fixed block top-0 l-0 w-screen h-screen z-999" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <div ref={modalRef} className="p-8 bg-white w-11/12 max-w-screen-md mx-auto mt-8 rounded-md shadow-md">
        <h1 className="text-3xl mb-2">Redirects have been published</h1>
        <p className="mb-6">
          The site is rebuilding, and the redirects will be live in about 15 minutes. If you would like the monitor the
          status of the build please see the{' '}
          <a
            className="underline text-blue-600"
            href="https://app.netlify.com/sites/ichabod-crane/deploys"
            target="_blank"
            rel="noreferrer"
          >
            Netlify deploy page
          </a>
          .
        </p>
        <div className="text-right">
          <Button color="blue" onClick={closeModal}>
            Ok!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishedModal;
