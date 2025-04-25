'use client';

import { useState } from 'react';
import { PlusCircle, Folder, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PromptGrid } from '@/components/prompt/PromptGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collection } from '@/lib/types';

// Sample collections
const sampleCollections: Collection[] = [
  {
    id: '1',
    name: 'Content Creation',
    userId: '1',
    promptIds: ['1', '6', '8', '10'],
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '2',
    name: 'Development',
    userId: '1',
    promptIds: ['3', '7', '9'],
    createdAt: new Date('2023-07-20'),
  },
  {
    id: '3',
    name: 'Academic',
    userId: '1',
    promptIds: ['4', '5'],
    createdAt: new Date('2023-08-12'),
  },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(sampleCollections);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        userId: '1', // Assuming current user
        promptIds: [],
        createdAt: new Date(),
      };
      
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setNewCollectionOpen(false);
    }
  };
  
  const handleSelectCollection = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Collections</h1>
        <Button onClick={() => setNewCollectionOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>
      
      <Tabs defaultValue="grid" className="mb-8">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <Card 
                key={collection.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectCollection(collection)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    {collection.name}
                  </CardTitle>
                  <CardDescription>
                    Created on {collection.createdAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground">
                    {collection.promptIds.length} prompts
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    View Collection
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <div className="divide-y border rounded-md overflow-hidden">
            {collections.map((collection) => (
              <div 
                key={collection.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => handleSelectCollection(collection)}
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {collection.promptIds.length} prompts • Created on {collection.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedCollection && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <FolderOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{selectedCollection.name}</h2>
          </div>
          
          {selectedCollection.promptIds.length > 0 ? (
            <PromptGrid initialPrompts={[]} savedPrompts={selectedCollection.promptIds} />
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">No prompts in this collection</h3>
              <p className="text-muted-foreground mb-4">
                Start adding prompts to build your collection
              </p>
              <Button onClick={() => window.location.href = '/explore'}>
                Browse Prompts
              </Button>
            </div>
          )}
        </div>
      )}
      
      <Dialog open={newCollectionOpen} onOpenChange={setNewCollectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCollectionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}