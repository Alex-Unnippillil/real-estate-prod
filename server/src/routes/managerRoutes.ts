import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";
import {
  getTeamMembers,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
} from "../controllers/teamControllers";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.get("/:cognitoId/properties", getManagerProperties);
router.post("/", createManager);
router.get("/:cognitoId/team", getTeamMembers);
router.post("/:cognitoId/team/invite", inviteTeamMember);
router.put("/:cognitoId/team/:memberId", updateTeamMemberRole);
router.delete("/:cognitoId/team/:memberId", removeTeamMember);

export default router;
