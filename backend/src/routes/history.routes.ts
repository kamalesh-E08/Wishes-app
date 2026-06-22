import { Router } from "express";
import Wish from "../models/Wish";
import { auth } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

/**
 * GET USER HISTORY
 */
router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const wishes = await Wish.find({
      user: req.user?.id,
    })
      .sort({
        createdAt: -1,
      })
      .limit(20);

    res.json(wishes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

/**
 * DELETE SINGLE WISH
 */
router.delete("/:id", auth, async (req: AuthRequest, res) => {
  try {
    const wish = await Wish.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.id,
    });

    if (!wish) {
      return res.status(404).json({
        success: false,
        message: "Wish not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

/**
 * DELETE MULTIPLE WISHES
 */
router.delete("/", auth, async (req: AuthRequest, res) => {
  try {
    const { ids } = req.body;

    await Wish.deleteMany({
      _id: {
        $in: ids,
      },
      user: req.user?.id,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

export default router;
