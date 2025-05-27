import express from "express";

const router = express.Router();

router.post("/save", async (req, res) => {
  const { treeId, nodes } = req.body;

  if (!treeId || !nodes || !Array.isArray(nodes)) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  try {
    const supabase = req.supabase;

    // Проверка UUID опустим для краткости

    // Удаляем старые узлы
    await supabase.from("tree_nodes").delete().eq("tree_id", treeId);

    // Вставляем узлы без partner_id
    const nodesWithoutPartner = nodes.map((node) => ({
      tree_id: treeId,
      id: node.id,
      x: node.x,
      y: node.y,
      label: node.label || "",
      parent_id: node.parentId || null,
      character_id: node.character_id || null,
      partner_id: null, // Пока null!
      partner_type: node.partnerType || null,
    }));

    const { error: insertError } = await supabase
      .from("tree_nodes")
      .insert(nodesWithoutPartner);

    if (insertError) throw insertError;

    // Обновляем partner_id отдельно, когда все узлы уже есть
    for (const node of nodes) {
      if (node.partnerId) {
        const { error: updateError } = await supabase
          .from("tree_nodes")
          .update({ partner_id: node.partnerId })
          .eq("id", node.id);

        if (updateError) throw updateError;
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    res.status(500).json({
      error: "Ошибка сохранения",
      details: error.message,
    });
  }
});

export default router;
