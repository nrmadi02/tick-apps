import PermissionsSection from './section/permissions.section';

export default function RolePermissionsContainer({ id }: { id: string }) {
  return (
      <PermissionsSection roleId={id} />
  );
}
