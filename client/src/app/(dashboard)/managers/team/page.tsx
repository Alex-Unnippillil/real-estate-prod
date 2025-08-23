"use client";

import { useState } from "react";
import {
  useGetAuthUserQuery,
  useGetTeamMembersQuery,
  useInviteTeamMemberMutation,
  useUpdateTeamMemberRoleMutation,
  useRemoveTeamMemberMutation,
} from "@/state/api";

const TeamPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const managerId = authUser?.cognitoInfo?.userId;
  const { data: members = [] } = useGetTeamMembersQuery(managerId!, {
    skip: !managerId,
  });
  const [invite] = useInviteTeamMemberMutation();
  const [updateRole] = useUpdateTeamMemberRoleMutation();
  const [remove] = useRemoveTeamMemberMutation();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerId) return;
    await invite({ cognitoId: managerId, email, role });
    setEmail("");
    setRole("Member");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Members</h1>
      <ul className="mb-6">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between mb-2 border-b pb-2"
          >
            <span>{member.email}</span>
            <div className="flex items-center gap-2">
              <select
                value={member.role}
                onChange={(e) =>
                  updateRole({
                    cognitoId: managerId!,
                    memberId: member.id,
                    role: e.target.value,
                  })
                }
                className="border rounded px-2 py-1"
              >
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </select>
              <button
                onClick={() =>
                  remove({ cognitoId: managerId!, memberId: member.id })
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {members.length === 0 && <li>No team members yet.</li>}
      </ul>
      <form onSubmit={handleInvite} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border px-2 py-1 flex-1"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Invite
        </button>
      </form>
    </div>
  );
};

export default TeamPage;

