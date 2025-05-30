"use client";
import { useState, useEffect } from "react";
import { useAttestationStore } from "@/store/useAttestation";
import { useSchemaStore } from "@/store/useSchema";

interface Props {
  children: React.ReactNode;
}

const Provider: React.FC<Props> = ({ children }) => {
  const { fetchAttestations } = useAttestationStore();
  const { fetchSchemas } = useSchemaStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAttestations(), fetchSchemas()]);
      } catch (error) {
        console.error("Error loading initial data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>; // Replace with a skeleton/loader component if needed
  }

  return <>{children}</>;
};

export default Provider;
