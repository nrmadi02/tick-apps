import EditEventSection from "./section/edit-event.section";

export default function EditEventContainer(props: { id: string }) {
  return <EditEventSection id={props.id} />;
}
