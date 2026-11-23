// Shows whichever pop-up window the modal store says is open.
//
// To add a new window: add its name to ModalType in src/store/modalStore.ts,
// then add a line for it in CONTENT below.

import type { ReactNode } from "react";
import Modal from "../../components/Modal";
import { useModalStore, type ModalType } from "../../store/modalStore";
import DirectoryWindow from "../directory/DirectoryWindow";
import ScheduleWindow from "../schedule/ScheduleWindow";
import WelcomeModal from "./WelcomeModal";

/** What each window shows, how it looks, and its name for screen readers. */
const CONTENT: Record<
  ModalType,
  { label: string; variant: "standard" | "banner"; render: () => ReactNode }
> = {
  welcome: { label: "Welcome", variant: "banner", render: () => <WelcomeModal /> },
  schedule: {
    label: "Room schedule",
    variant: "standard",
    render: () => <ScheduleWindow />,
  },
  directory: {
    label: "Directory",
    variant: "standard",
    render: () => <DirectoryWindow />,
  },
};

export default function ModalHost() {
  const type = useModalStore((state) => state.type);
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);

  if (!type) return null;
  const content = CONTENT[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      label={content.label}
      variant={content.variant}
    >
      {content.render()}
    </Modal>
  );
}
