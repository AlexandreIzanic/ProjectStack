import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import supabase from "./utils/supabase";
import { useEffect, useState } from "react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
function App() {
  const [ressources, setRessources] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState({
    project: null,
  });
  const getRessources = async () => {
    let query = supabase
      .from("ressources")
      .select("*, tag:tags(*), project:projects(*)");

    if (filter.project) query = query.eq("project_id", filter.project);

    const { data } = await query;

    setRessources(data);
  };

  const getTags = async () => {
    const { data } = await supabase.from("tags").select("*");
    setTags(data);
  };

  const getProjects = async () => {
    const { data } = await supabase.from("projects").select("*");
    setProjects(data);
  };

  const addRessource = async () => {
    await supabase
      .from("ressources")
      .insert([
        { name: title, url: url, tag_id: tag, project_id: selectedProject },
      ]);
    setTitle("");
    setUrl("");
    getRessources();
  };

  const deleteRessource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ressource?"))
      return;
    await supabase.from("ressources").delete().eq("id", id);
    getRessources();
  };

  const openAllUrls = () => {
    if (ressources.length === 0) alert("No ressources to open");

    if (ressources.length > 5)
      return window.confirm(
        "Are you sure you want to open all these ressources?"
      );

    ressources.forEach((ressource) => {
      window.open(ressource.url, "_blank");
    });
  };

  useEffect(() => {
    getRessources();
  }, [filter]);

  useEffect(() => {
    getTags();
    getProjects();
  }, []);
  return (
    <>
      <div className="flex gap-2 my-3 justify-center">
        {projects.map((project) => (
          <Button
            onClick={() => {
              if (filter.project === project.id) {
                setFilter((prevFilter) => ({ ...prevFilter, project: null }));
              } else {
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  project: project.id,
                }));
              }
            }}
            className={`${
              filter.project === project.id
                ? "bg-blue-500 hover:bg-blue-400"
                : ""
            }`}
          >
            {project.name}
          </Button>
        ))}
      </div>

      <div className="flex gap-2  w-1/2 m-auto">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Select onValueChange={(value) => setTag(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tags" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedProject(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Projects" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => addRessource()}>Add</Button>
      </div>

      <div className="flex gap-3 m-3 flex-wrap">
        <Button onClick={() => openAllUrls()}>Open All</Button>
        {ressources.map((ressource) => (
          <div key={ressource.id}>
            <a href={ressource.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full hover:bg-blue-100 hover:scale-105">
                <CardHeader></CardHeader>

                <CardTitle>
                  <div className="flex justify-center gap-2 px-5">
                    <img
                      className="object-contain"
                      src={`https://www.google.com/s2/favicons?domain=${ressource.url}`}
                    ></img>
                    {ressource.name}
                  </div>
                </CardTitle>
                <div className="bg-black text-slate-200   mx-5 rounded-lg text-sm font-light">
                  {ressource.tag?.name}
                </div>
                <CardFooter>
                  <div className="bg-black   mx-5 rounded-lg text-slate-200 text-sm font-light">
                    {ressource.project?.name}
                  </div>
                  <button
                    className="text-red-400 underline"
                    onClick={() => deleteRessource(ressource.id)}
                  >
                    Delete
                  </button>
                </CardFooter>
              </Card>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
