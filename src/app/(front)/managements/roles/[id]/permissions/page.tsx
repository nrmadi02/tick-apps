import RolePermissionsContainer from "~/features/front/managements/roles/[id]/permissions/role-permissions.container";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <RolePermissionsContainer id={(await params).id} />
}
