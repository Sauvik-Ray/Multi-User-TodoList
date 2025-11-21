import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getItems, createItem, updateItem, deleteItem } from "@/api/itemApi";
import { connectSocket, sendUpdate } from "@/websocket/socket";
import { getSession } from "@/hooks/useRoomStorage";

export default function ListPage() {
  const { listId } = useParams();
  const session = getSession();
  const roomId = session.roomId;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getItems(listId);
      setItems(data || []);
    } catch (err) {
      console.error("Failed to fetch items", err);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    if (!listId) return;
    fetchItems();

    if (roomId) {
      const onMessage = (msg) => {
        const refreshTypes = [
          "ITEM_CREATED",
          "ITEM_UPDATED",
          "ITEM_DELETED",
          "LIST_UPDATED",
          "LIST_DELETED",
        ];

        if (refreshTypes.includes(msg.type)) {
          fetchItems();
        }
      };

      connectSocket(roomId, onMessage);
    }
  }, [listId, roomId, fetchItems]);

  const handleCreateItem = async () => {
    if (!newItem.trim()) return;
    setSaving(true);
    try {
      await createItem(listId, newItem.trim());
      setNewItem("");

      sendUpdate(roomId, { type: "ITEM_CREATED" });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Could not create item");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      await updateItem(item.id, item.content, !item.completed);

      sendUpdate(roomId, { type: "ITEM_UPDATED" });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to update item");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteItem(id);

      sendUpdate(roomId, { type: "ITEM_DELETED", itemId: id });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            List Items
          </h2>

          <Link to={`/room/${roomId}`}>
            <Button variant="outline" className="h-9 font-medium">
              Back to Room
            </Button>
          </Link>
        </div>

        {/* Card */}
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b1e27] shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Items in this list
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Add Item */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <Input
                placeholder="Add a new item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="h-11 bg-white dark:bg-[#252933] border-gray-300 
                dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />

              <Button
                onClick={handleCreateItem}
                disabled={saving}
                className="min-w-[120px] h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                {saving ? "Adding..." : "Add"}
              </Button>
            </div>

            {/* Items List */}
            {loading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Loading items...
              </div>
            ) : items.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No items yet. Add something above.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3 py-3 px-4 rounded-lg
                    bg-gray-50 dark:bg-[#252933] border border-gray-200 dark:border-gray-600"
                  >
                    {/* Checkbox + text */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={it.completed}
                        onChange={() => handleToggle(it)}
                      />
                      <div
                        className={
                          it.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800 dark:text-gray-100"
                        }
                      >
                        {it.content}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggle(it)}
                        className="h-9 min-w-[90px] border-indigo-300 text-indigo-500 hover:bg-indigo-600/10"
                      >
                        Toggle
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(it.id)}
                        className="h-9 min-w-[90px] bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
