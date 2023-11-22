import { useToast } from "@chakra-ui/react"
import { useFrappeDeleteDoc, useSWRConfig } from "frappe-react-sdk"
import { AlertBanner, ErrorBanner } from "../../layout/AlertBanner"
import { useParams } from "react-router-dom"
import { AlertDialog, Button, Callout, Flex, Text } from "@radix-ui/themes"
import { Loader } from "@/components/common/Loader"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface DeleteMessageModalProps {
    onClose: (refresh?: boolean) => void,
    channelMessageID: string
}

export const DeleteMessageModal = ({ onClose, channelMessageID }: DeleteMessageModalProps) => {

    const { deleteDoc, error, loading: deletingDoc } = useFrappeDeleteDoc()
    const toast = useToast()

    const { mutate } = useSWRConfig()

    // const updateMessages = useCallback(() => {
    //     mutate(`get_messages_for_channel_${channelMessageID}`)
    // }, [mutate, channelMessageID])

    const { channelID } = useParams()

    const onSubmit = () => {
        return deleteDoc('Raven Message', channelMessageID
        ).then(() => {
            toast({
                title: 'Message deleted successfully',
                status: 'success',
                duration: 1500,
                position: 'bottom',
                variant: 'solid',
                isClosable: true
            })
            mutate(`get_messages_for_channel_${channelID}`)
            onClose()
        }).catch((e) => {
            toast({
                title: 'Error: could not delete message.',
                status: 'error',
                duration: 3000,
                position: 'bottom',
                variant: 'solid',
                isClosable: true,
                description: `${e.message}`
            })
        })
    }

    return (
        <>
            <AlertDialog.Title>
                Delete Message
            </AlertDialog.Title>

            <Flex direction={'column'} gap='2'>
                <Callout.Root color="red" size='1'>
                    <Callout.Icon>
                        <ExclamationTriangleIcon />
                    </Callout.Icon>
                    <Callout.Text size='1'>
                        This action is permanent and cannot be undone.
                    </Callout.Text>
                </Callout.Root>

                <ErrorBanner error={error} />
                <Text size='1'>Are you sure you want to delete this message? It will be deleted for all users.</Text>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                        Cancel
                    </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                    <Button variant="solid" color="red" onClick={onSubmit} disabled={deletingDoc}>
                        {deletingDoc && <Loader />}
                        {deletingDoc ? "Deleting" : "Delete"}
                    </Button>
                </AlertDialog.Action>
            </Flex>
        </>
    )
}