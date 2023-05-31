interface BlockModalProps {
  children?: React.ReactNode;
}
export default function BlockModal({ children }: BlockModalProps) {
  return <div className="modal-blocker flex-row">{children}</div>;
}
