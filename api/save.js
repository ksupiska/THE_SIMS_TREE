import express from "express";

const router = express.Router();

router.post("/save", async (req, res) => {
  const { treeId, nodes } = req.body;

  if (!treeId || !nodes || !Array.isArray(nodes)) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  try {
    const supabase = req.supabase;

    // Проверяем, что characterId - это UUID
    const isValidUUID = (id) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      );

    console.log(
      "Проверка узлов:",
      nodes.map((node) => ({
        id: node.id,
        label: node.label,
        character: node.character?.id,
      }))
    );

    for (const node of nodes) {
      if (node.characterId && !isValidUUID(node.characterId)) {
        throw new Error(
          `Некорректный characterId: "${node.characterId}". Должен быть UUID.`
        );
      }
    }

    // Удаляем старые узлы
    await supabase.from("tree_nodes").delete().eq("tree_id", treeId);

    // Подготавливаем данные для вставки
    const nodesToInsert = nodes.map((node) => ({
      tree_id: treeId,
      id: node.id, // ← если id узла нужен
      x: node.x,
      y: node.y,
      label: node.label || "",
      parent_id: node.parentId || null,
      character_id: node.character_id || null, // ← используем character_id из запроса
      partner_id: node.partnerId || null,
      partner_type: node.partnerType || null,
    }));

    console.log("Данные для вставки в Supabase:", nodesToInsert);
    // Вставляем новые узлы
    const { error } = await supabase.from("tree_nodes").insert(nodesToInsert);

    if (error) throw error;

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
