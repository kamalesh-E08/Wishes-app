import { Router } from "express";
import Wish from "../models/Wish";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const wishes = await Wish.find().limit(20).sort({ createdAt: -1 });

    res.json(wishes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Wish.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;

    await Wish.deleteMany({
      _id: { $in: ids },
    });

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
});

export default router;
