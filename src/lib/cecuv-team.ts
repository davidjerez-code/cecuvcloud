import andres from "@/assets/team/foto-andres.jpeg.asset.json";
import david from "@/assets/team/foto-david.jpeg.asset.json";
import sara from "@/assets/team/foto-sara.jpeg.asset.json";

export const researchTeam = [
  { id: "john", name: "John Alejandro Almanza Valderrama", initials: "JA", career: "Ingeniería Industrial", photoUrl: "" },
  { id: "andres", name: "Andrés Felipe Leguizamón Rodríguez", initials: "AL", career: "Ingeniería Industrial", photoUrl: andres.url },
  { id: "david", name: "David Stiven Jerez Díaz", initials: "DJ", career: "Ingeniería Industrial", photoUrl: david.url },
  { id: "sara", name: "Sara Valentina Quintana López", initials: "SQ", career: "Ingeniería de Sistemas", photoUrl: sara.url },
] as const;

export const researchMentor = "Pablo Elías Velásquez Perilla";
