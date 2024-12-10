
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import PermissionsTableSection from "./section/permissions-table.section";
import RolesTableSection from "./section/roles-table.section";
import SubjectsTableSection from "./section/subjects-table.section";

export default function ManagementsContainer() {
  return (
    <Tabs defaultValue="roles">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="subjects">Subjects</TabsTrigger>
      </TabsList>

      <TabsContent value="roles">
        <RolesTableSection />
      </TabsContent>
      <TabsContent value="permissions">
        <PermissionsTableSection />
      </TabsContent>
      <TabsContent value="subjects">
        <SubjectsTableSection />
      </TabsContent>

    </Tabs>
  );
}
