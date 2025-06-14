
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjects } from "@/pages/ProjectContext";
import StepEditor from "@/components/StepEditor";
import React from "react";

const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional(),
  author: z.string().min(2, "Author is required"),
  image: z.string().url("Must be a valid image URL"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  steps: z
    .array(
      z.object({
        title: z.string().min(2, "Title required"),
        content: z.string().min(5, "Step details required"),
      })
    )
    .min(1, "At least one step is required"),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const DEFAULT_STEP = { title: "", content: "" };

const CreateProject = () => {
  const { addProject } = useProjects();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      author: "",
      image: "",
      url: "",
      steps: [{ title: "", content: "" }],
    },
    mode: "onBlur",
  });

  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = form;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "steps",
  });

  // ----> Ensure all required fields before calling addProject
  const onSubmit = async (values: ProjectFormValues) => {
    // Enforce all required step keys
    const steps = values.steps.map((s) => ({
      title: s.title ?? "",
      content: s.content ?? "",
    }));

    const cleanVals = {
      ...values,
      title: values.title ?? "",
      description: values.description ?? "",
      content: values.content ?? "",
      author: values.author ?? "",
      image: values.image ?? "",
      url: values.url ?? "",
      steps,
    };

    try {
      await addProject(cleanVals); // satisfies Omit<Project, "id" | "date">
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      reset();
      navigate("/admin");
    } catch (err) {
      toast({
        title: "Error",
        description: "There was a problem creating the project.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Project - MakerBrains</title>
      </Helmet>
      <div className="my-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-xl shadow-lg border">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                autoComplete="off"
              >
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Title" {...field} required />
                      </FormControl>
                      <FormDescription>Use a clear, descriptive project name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief summary of the project" {...field} required />
                      </FormControl>
                      <FormDescription>Keep it concise and informative.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full project details" {...field} />
                      </FormControl>
                      <FormDescription>Optional: Add further explanation, context, or background.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author *</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Author" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Direct link to a project image"
                          {...field}
                          required
                          inputMode="url"
                        />
                      </FormControl>
                      <FormDescription>
                        Example: https://example.com/myproject.jpg
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Link (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Link to more project resources" {...field} inputMode="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel>
                    Project Steps <span className="text-destructive">*</span>
                  </FormLabel>
                  {errors?.steps?.message && (
                    <FormMessage>{errors.steps.message as string}</FormMessage>
                  )}
                  {fields.map((item, idx) => (
                    <div key={item.id} className="flex flex-col gap-1 mb-3">
                      <StepEditor
                        index={idx}
                        // All steps always filled
                        step={{
                          title: getValues(`steps.${idx}.title`) ?? "",
                          content: getValues(`steps.${idx}.content`) ?? ""
                        }}
                        onChange={(i, updatedStep) => update(i, updatedStep)}
                        onRemove={() => remove(idx)}
                        showRemove={fields.length > 1}
                      />
                      {(errors.steps?.[idx]?.title || errors.steps?.[idx]?.content) && (
                        <FormMessage>
                          {errors.steps?.[idx]?.title?.message || errors.steps?.[idx]?.content?.message}
                        </FormMessage>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-1"
                    onClick={() => append(DEFAULT_STEP)}
                  >
                    + Add Step
                  </Button>
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  * Required fields
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateProject;
