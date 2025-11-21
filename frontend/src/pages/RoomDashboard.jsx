import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { getListsByRoom, createList, deleteList } from "@/api/listApi";
import {
  getRoom,
  updateRoom,
  deleteRoom as apiDeleteRoom,
} from "@/api/roomApi";

import { connectSocket, sendUpdate } from "../websocket/socket";
import { getSession, saveSession } from "@/hooks/useRoomStorage";
import { useToast } from "@/hooks/use-toast";

export default function RoomDashboard() {
  const { roomId: roomIdParam } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const session = getSession();
  const roomId = roomIdParam || session.roomId;

  const [room, setRoom] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [adminKey] = useState(session.adminKey || null);

  const fetchRoom = useCallback(async () => {
    try {
      const { data } = await getRoom(roomId);
      setRoom(data);

      saveSession({
        ...getSession(),
        joinKey: data.joinKey || getSession().joinKey,
      });
    } catch (err) {
      toast({
        title: "Room Not Found",
        description: "Room may have been deleted.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [roomId, navigate, toast]);

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getListsByRoom(roomId);
      setLists(data.lists || data);
    } catch {
      toast({
        title: "List Fetch Error",
        description: "Unable to load lists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [roomId, toast]);

  useEffect(() => {
    if (!roomId) return navigate("/");

    fetchRoom();
    fetchLists();

    const onMessage = (msg) => {
      if (
        [
          "LIST_CREATED",
          "LIST_UPDATED",
          "LIST_DELETED",
          "ROOM_UPDATED",
        ].includes(msg.type)
      ) {
        fetchLists();
      }
    };

    connectSocket(roomId, onMessage);
  }, [roomId, fetchRoom, fetchLists, navigate]);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    setCreating(true);
    try {
      const { data } = await createList(roomId, newListName.trim());
      setNewListName("");
      setLists((s) => [data, ...s]);

      sendUpdate(roomId, {
        type: "LIST_CREATED",
      });

      toast({
        title: "List Created",
        description: `"${data.name}" has been added.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not create list.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm("Delete this list?")) return;

    try {
      await deleteList(listId);
      setLists((s) => s.filter((l) => l.id !== listId));

      sendUpdate(roomId, {
        type: "LIST_DELETED",
        listId,
      });

      toast({
        title: "List Deleted",
        description: "Successfully removed.",
      });
    } catch {
      toast({
        title: "Failed",
        description: "Deletion failed.",
        variant: "destructive",
      });
    }
  };

  const handleRenameRoom = async () => {
    if (!adminKey)
      return toast({
        title: "Restricted",
        description: "Admin key required.",
      });

    const newName = prompt("New room name", room?.name || "");
    if (!newName) return;

    try {
      await updateRoom(roomId, newName, adminKey);
      await fetchRoom();

      sendUpdate(roomId, {
        type: "ROOM_UPDATED",
      });

      toast({ title: "Room Updated", description: "New name saved." });
    } catch {
      toast({
        title: "Error",
        description: "Admin key might be wrong.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async () => {
    if (!adminKey)
      return toast({
        title: "Restricted",
        description: "Admin key required.",
      });

    if (!confirm("This will delete the entire room permanently.")) return;

    try {
      await apiDeleteRoom(roomId, adminKey);
      saveSession({});
      navigate("/");
    } catch {
      toast({
        title: "Failed",
        description: "Admin key might be incorrect.",
        variant: "destructive",
      });
    }
  };

  const joinKey = room?.joinKey || getSession().joinKey;
  const shareLink = `${window.location.origin}/join/${joinKey}`;

  return (
    <AppLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <Card className="rounded-xl border bg-white dark:bg-[#1b1e27] border-gray-200 dark:border-gray-700 shadow-md p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {room?.name || "Room"}
              </h2>

              <div className="flex gap-3 flex-wrap">
                <Badge variant="outline" className="font-mono">
                  Room ID: {roomId}
                </Badge>

                {adminKey && (
                  <Badge className="bg-green-600 text-white font-medium">
                    Admin
                  </Badge>
                )}
              </div>

              <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                Join Key: <span className="font-bold">{joinKey}</span>
              </div>

              {/* SHARE LINK */}
              <div className="flex items-center gap-2">
                <div className="text-sm truncate font-mono text-indigo-600 dark:text-indigo-300">
                  {shareLink}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast({
                      title: "Copied",
                      description: "Share link copied.",
                    });
                  }}
                  className="border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                >
                  Copy
                </Button>
              </div>

              {adminKey && (
                <div className="text-sm font-mono text-red-600 dark:text-red-400 pt-1">
                  Admin Key: {adminKey}
                </div>
              )}
            </div>

            {adminKey && (
              <div className="flex gap-3 self-start lg:self-center">
                <Button
                  className="min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleRenameRoom}
                >
                  Rename
                </Button>

                <Button
                  className="min-w-[120px] bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteRoom}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* LISTS */}
        <Card className="rounded-xl border bg-white dark:bg-[#1b1e27] border-gray-200 dark:border-gray-700 shadow-md p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Lists
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ADD LIST */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="New list name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="h-11 bg-white dark:bg-[#252933] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
              />

              <Button
                onClick={handleCreateList}
                disabled={creating}
                className="min-w-[130px] h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                {creating ? "Creating..." : "Add List"}
              </Button>
            </div>

            {loading ? (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Loading lists...
              </div>
            ) : lists.length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                No lists created yet — start by adding one.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {lists.map((l) => (
                  <Card
                    key={l.id}
                    className="rounded-xl border bg-white dark:bg-[#252933] border-gray-200 dark:border-gray-700 shadow-sm p-5 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <Link
                        to={`/list/${l.id}`}
                        className="font-medium text-lg text-gray-800 dark:text-gray-200 hover:underline"
                      >
                        {l.name}
                      </Link>

                      <div className="flex flex-col gap-2 items-end">
                        <Button
                          size="sm"
                          asChild
                          className="min-w-[90px] bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Link to={`/list/${l.id}`}>Open</Link>
                        </Button>

                        {adminKey && (
                          <Button
                            size="sm"
                            className="min-w-[90px] bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDeleteList(l.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
