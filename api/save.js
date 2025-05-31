import express from "express";

const router = express.Router();
router.post("/save", async (req, res) => {
  const supabase = req.supabase; // <- вот сюда

  const { treeId, nodes } = req.body;

  if (!treeId || !Array.isArray(nodes)) {
    return res.status(400).json({ error: "Неверные данные" });
  }

  try {
    // Удаляем старые узлы
    await supabase.from("tree_nodes").delete().eq("tree_id", treeId);

    // Вставляем новые
    const { error } = await supabase.from("tree_nodes").insert(
      nodes.map((node) => ({
        id: node.id,
        tree_id: treeId,
        label: node.label,
        x: node.x,
        y: node.y,
        character_id: node.characterId || node.character_id,
        parent1_id: node.parent1_id,
        parent2_id: node.parent2_id,
        partner1_id: node.partner1_id,
        partner2_id: node.partner2_id, // исправлено, см. ниже
        partner_type: node.partner_type ?? node.partnerType ?? null,
      }))
    );

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при сохранении дерева:", error);
    res.status(500).json({ error: "Ошибка при сохранении" });
  }
});

export default router;
