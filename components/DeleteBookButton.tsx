import React from 'react';
import { useDeleteBookMutation } from '../graphql/generated';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface DeleteBookButtonProps {
  id: string;
  onDeleted?: () => void;
}

export function DeleteBookButton({ id, onDeleted }: DeleteBookButtonProps) {
  const [deleteBook, { loading }] = useDeleteBookMutation({
    onCompleted: () => {
      onDeleted && onDeleted();
    },
    onError: (err) => {
      alert('Delete error: ' + err.message);
    }
  });

  const handleDelete = async (close: () => void) => {
    await deleteBook({ variables: { id } });
    close();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-lg font-semibold">Delete Book</Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">
            Are you sure you want to delete this book? This action cannot be undone.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(() => {});
                }}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 