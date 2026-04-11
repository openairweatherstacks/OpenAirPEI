"use client";

import { motion } from "framer-motion";

import { ConditionsCard } from "@/components/conditions/ConditionsCard";
import type { LocationConditions } from "@/lib/types";

export function LocationGrid({ locations }: { locations: LocationConditions[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {locations.map((entry, index) => (
        <motion.div
          key={entry.location.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
        >
          <ConditionsCard entry={entry} />
        </motion.div>
      ))}
    </div>
  );
}
