import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

import { RoleRequest, roleSchema } from "../types/role-request.type";

interface FormRoleSectionProps {
  closeDialog: () => void;
}

export default function FormRoleSection({ closeDialog }: FormRoleSectionProps) {
  const form = useForm<RoleRequest>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { refetch } = api.role.getAllRoles.useQuery();
  const { mutate, isPending } = api.role.addRole.useMutation({
    onSuccess: ({ id }) => {
      toast.success(`Created role successfully with id ${id}`);
      refetch();
      closeDialog();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  async function onSubmit(values: RoleRequest) {
    try {
      mutate(values);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl>
                  <Input id="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Input id="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Loading..." : "Add Role"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
