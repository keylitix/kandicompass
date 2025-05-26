// import React, { FC, useEffect, useRef, useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
// import showNotification from '../../../components/extras/showNotification';
// import Icon from '../../../components/icon/Icon';
// import FormGroup from '../../../components/bootstrap/forms/FormGroup';
// import Input from '../../../components/bootstrap/forms/Input';
// import Button from '../../../components/bootstrap/Button';
// import Select from '../../../components/bootstrap/forms/Select';
// import Option from '../../../components/bootstrap/Option';

// import {
//   useAddThreadMutation,
//   useUpdateThreadMutation,
// } from '../../../redux/api/thredApi';
// import { fetchUsers } from '../../../redux/api/userApi';

// interface IThread {
//   _id?: string;
//   threadName: string;
//   visibility: 'public' | 'private';
//   description?: string;
//   ownerId?: string;
// }

// interface IThreadAddModalProps {
//   id: string;
//   isOpen: boolean;
//   editItem?: IThread;
//   setIsOpen: (isOpen: boolean) => void;
//   onSuccess?: () => void;
// }

// const ThreadAddModal: FC<IThreadAddModalProps> = ({
//   id,
//   isOpen,
//   setIsOpen,
//   editItem,
//   onSuccess,
// }) => {
//   const [addThread] = useAddThreadMutation();
//   const [updateThread] = useUpdateThreadMutation();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [allUsers, setAllUsers] = useState<any[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showUserList, setShowUserList] = useState(false);
//   const userBoxRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const data = await fetchUsers();
//         setAllUsers(data);
//         setFilteredUsers(data);
//       } catch (error) {
//         showNotification(
//           <span className="d-flex align-items-center">
//             <Icon icon="Error" size="lg" className="me-1" />
//             <span>Failed to load users</span>
//           </span>,
//           'Please try again later.'
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredUsers(allUsers);
//     } else {
//       setFilteredUsers(
//         allUsers.filter((user) =>
//           user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
//   }, [searchTerm, allUsers]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         userBoxRef.current &&
//         !userBoxRef.current.contains(event.target as Node)
//       ) {
//         setShowUserList(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       threadName: editItem?.threadName || '',
//       visibility: editItem?.visibility || 'Public',
//       description: editItem?.description || '',
//       ownerId: editItem?.ownerId || '',
//     },
//     validationSchema: Yup.object({
//       threadName: Yup.string()
//         .required('Thread name is required')
//         .min(3, 'Thread name must be at least 3 characters'),
//       visibility: Yup.string()
//         .required('Visibility is required')
//         .oneOf(['Public', 'Private'], 'Invalid visibility option'),
//       description: Yup.string().min(5, 'Description must be at least 5 characters'),
//       ownerId: Yup.string().required('Owner is required'),
//     }),
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       setIsSubmitting(true);
//       try {
//         if (editItem?._id) {
//           await updateThread({ id: editItem._id, body: values }).unwrap();
//         } else {
//           await addThread(values).unwrap();
//         }

//         showNotification(
//           <span className="d-flex align-items-center">
//             <Icon icon="CheckCircle" size="lg" className="me-1" />
//             <span>{editItem ? 'Thread Updated' : 'Thread Added'}</span>
//           </span>,
//           `${values.threadName} has been ${editItem ? 'updated' : 'added'} successfully.`
//         );

//         formik.resetForm();
//         setIsOpen(false);
//         onSuccess?.();
//       } catch (error) {
//         console.error(error);
//         showNotification(
//           <span className="d-flex align-items-center">
//             <Icon icon="Error" size="lg" className="me-1" />
//             <span>Error</span>
//           </span>,
//           `Failed to ${editItem ? 'update' : 'add'} thread. Please try again.`
//         );
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//   });

//   if (!isOpen) return null;

//   return (
//     <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="md" titleId={id} isStaticBackdrop isCentered>
//       <ModalHeader setIsOpen={setIsOpen} className="p-4">
//         <ModalTitle id={id}>{editItem ? 'Edit Thread' : 'Add New Thread'}</ModalTitle>
//       </ModalHeader>
//       <ModalBody className="px-4">
//         {/* Thread Name */}
//         <FormGroup id="threadName" label="Thread Name" className="mb-3">
//           <Input
//             id="threadName"
//             name="threadName"
//             placeholder="Enter thread name"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.threadName}
//             isTouched={!!formik.touched.threadName}
//             isValid={!formik.errors.threadName}
//             invalidFeedback={formik.errors.threadName}
//           />
//         </FormGroup>

//         {/* Description */}
//         <FormGroup id="description" label="Description" className="mb-3">
//           <Input
//             id="description"
//             name="description"
//             placeholder="Enter description"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.description}
//             isTouched={!!formik.touched.description}
//             isValid={!formik.errors.description}
//             invalidFeedback={formik.errors.description}
//           />
//         </FormGroup>

//         {/* Visibility */}
//         <FormGroup id="visibility" label="Visibility" className="mb-3">
//           <Select
//             id="visibility"
//             name="visibility"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.visibility}
//             isTouched={!!formik.touched.visibility}
//             isValid={!formik.errors.visibility}
//             invalidFeedback={formik.errors.visibility}
//             ariaLabel=""
//           >
//             <Option value="Public">Public</Option>
//             <Option value="Private">Private</Option>
//           </Select>
//         </FormGroup>

//         {/* Owner Selection with Click-to-Show List */}
//         <FormGroup id="ownerId" label="Owner (search by name)" className="mb-3">
//           <div ref={userBoxRef}>
//             <Input
//               type="text"
//               placeholder="Search user..."
//               onFocus={() => setShowUserList(true)}
//               onChange={(e : any) => {
//                 setSearchTerm(e.target.value);
//                 setShowUserList(true);
//                 formik.setFieldTouched('ownerId', true);
//               }}
//               value={searchTerm}
//               className="mb-2"
//             />
//             {showUserList ? (
//               <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                 {isLoading ? (
//                   <div>Loading users...</div>
//                 ) : filteredUsers.length === 0 ? (
//                   <div className="text-muted">No user found</div>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <div
//                       key={user._id}
//                       className={`p-2 rounded mb-1 ${
//                         formik.values.ownerId === user._id ? 'bg-primary text-white' : 'hover:bg-light'
//                       }`}
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => {
//                         formik.setFieldValue('ownerId', user._id);
//                         setSearchTerm(user.fullName);
//                         setShowUserList(false);
//                       }}
//                     >
//                       {user.fullName}
//                     </div>
//                   ))
//                 )}
//               </div>
//             ) : null}
//             {formik.touched.ownerId && formik.errors.ownerId && (
//               <div className="text-danger mt-1">{formik.errors.ownerId}</div>
//             )}
//           </div>
//         </FormGroup>
//       </ModalBody>

//       <ModalFooter className="px-4 pb-4">
//         <Button color="secondary" onClick={() => setIsOpen(false)} className="me-2" isDisable={isSubmitting}>
//           Cancel
//         </Button>
//         <Button color="primary" onClick={formik.handleSubmit} isDisable={isSubmitting}>
//           {editItem ? 'Update Thread' : 'Add Thread'} {isSubmitting && '...'}
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default ThreadAddModal;

// import React, { FC, useEffect, useRef, useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
// import showNotification from '../../../components/extras/showNotification';
// import Icon from '../../../components/icon/Icon';
// import FormGroup from '../../../components/bootstrap/forms/FormGroup';
// import Input from '../../../components/bootstrap/forms/Input';
// import Button from '../../../components/bootstrap/Button';
// import Select from '../../../components/bootstrap/forms/Select';
// import Option from '../../../components/bootstrap/Option';

// import {
//   useAddThreadMutation,
//   useUpdateThreadMutation,
// } from '../../../redux/api/thredApi';
// import { fetchUsers } from '../../../redux/api/userApi';

// interface IThread {
//   _id?: string;
//   threadName: string;
//   visibility: 'Public' | 'Private';
//   description?: string;
//   ownerId?: string;
//   members?: string[];
// }

// interface IThreadAddModalProps {
//   id: string;
//   isOpen: boolean;
//   editItem?: IThread;
//   setIsOpen: (isOpen: boolean) => void;
//   onSuccess?: () => void;
// }

// const ThreadAddModal: FC<IThreadAddModalProps> = ({
//   id,
//   isOpen,
//   setIsOpen,
//   editItem,
//   onSuccess,
// }) => {
//   const [addThread] = useAddThreadMutation();
//   const [updateThread] = useUpdateThreadMutation();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [allUsers, setAllUsers] = useState<any[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showUserList, setShowUserList] = useState(false);
//   const userBoxRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const data = await fetchUsers();
//         setAllUsers(data);
//         setFilteredUsers(data);
//       } catch (error) {
//         showNotification(
//           <span className="d-flex align-items-center">
//             <Icon icon="Error" size="lg" className="me-1" />
//             <span>Failed to load users</span>
//           </span>,
//           'Please try again later.'
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredUsers(allUsers);
//     } else {
//       setFilteredUsers(
//         allUsers.filter((user) =>
//           user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
//   }, [searchTerm, allUsers]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         userBoxRef.current &&
//         !userBoxRef.current.contains(event.target as Node)
//       ) {
//         setShowUserList(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       threadName: editItem?.threadName || '',
//       visibility: editItem?.visibility || 'Public',
//       description: editItem?.description || '',
//       ownerId: editItem?.ownerId || '',
//       members: editItem?.members || [],
//     },
//     validationSchema: Yup.object({
//       threadName: Yup.string()
//         .required('Thread name is required')
//         .min(3, 'Thread name must be at least 3 characters'),
//       visibility: Yup.string()
//         .required('Visibility is required')
//         .oneOf(['Public', 'Private'], 'Invalid visibility option'),
//       description: Yup.string().min(5, 'Description must be at least 5 characters'),
//       ownerId: Yup.string().required('Owner is required'),
//       members: Yup.array()
//         .of(Yup.string())
//         .min(1, 'Select at least one member')
//         .required('Members are required'),
//     }),
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       setIsSubmitting(true);
//       try {
//         // Prepare payload for backend
//         const payload = {
//           threadName: values.threadName,
//           description: values.description,
//           visibility: values.visibility,
//           ownerId: values.ownerId,
//           members: values.members,
//           beads: [], // Optional, keep empty or add if needed
//         };

//         if (editItem?._id) {
//           await updateThread({ id: editItem._id, body: payload }).unwrap();
//         } else {
//           await addThread(payload).unwrap();
//         }

//         showNotification(
//           <span className="d-flex align-items-center">
//             <Icon icon="CheckCircle" size="lg" className="me-1" />
//             <span>{editItem ? 'Thread Updated' : 'Thread Added'}</span>
//           </span>,
//           `${values.threadName} has been ${editItem ? 'updated' : 'added'} successfully.`
//         );

//         formik.resetForm();
//         setIsOpen(false);
//         onSuccess?.();
//       } catch (error) {
//         console.error(error);
//         showNotification(
//           <span className="d-flex align-items-center">
//             <Icon icon="Error" size="lg" className="me-1" />
//             <span>Error</span>
//           </span>,
//           `Failed to ${editItem ? 'update' : 'add'} thread. Please try again.`
//         );
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//   });

//   if (!isOpen) return null;

//   // Helper for checking if user is selected as member
//   const isUserSelected = (userId: string) => formik.values.members.includes(userId);

//   // Handler for toggling member selection
//   const toggleMember = (userId: string, fullName: string) => {
//     let newMembers: string[] = [];
//     if (isUserSelected(userId)) {
//       // Remove user from members
//       newMembers = formik.values.members.filter((id) => id !== userId);
//     } else {
//       // Add user to members
//       newMembers = [...formik.values.members, userId];
//     }
//     formik.setFieldValue('members', newMembers);
//   };

//   return (
//     <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="md" titleId={id} isStaticBackdrop isCentered>
//       <ModalHeader setIsOpen={setIsOpen} className="p-4">
//         <ModalTitle id={id}>{editItem ? 'Edit Thread' : 'Add New Thread'}</ModalTitle>
//       </ModalHeader>
//       <ModalBody className="px-4">
//         {/* Thread Name */}
//         <FormGroup id="threadName" label="Thread Name" className="mb-3">
//           <Input
//             id="threadName"
//             name="threadName"
//             placeholder="Enter thread name"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.threadName}
//             isTouched={!!formik.touched.threadName}
//             isValid={!formik.errors.threadName}
//             invalidFeedback={formik.errors.threadName}
//           />
//         </FormGroup>

//         {/* Description */}
//         <FormGroup id="description" label="Description" className="mb-3">
//           <Input
//             id="description"
//             name="description"
//             placeholder="Enter description"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.description}
//             isTouched={!!formik.touched.description}
//             isValid={!formik.errors.description}
//             invalidFeedback={formik.errors.description}
//           />
//         </FormGroup>

//         {/* Visibility */}
//         <FormGroup id="visibility" label="Visibility" className="mb-3">
//           <Select
//             id="visibility"
//             name="visibility"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.visibility}
//             isTouched={!!formik.touched.visibility}
//             isValid={!formik.errors.visibility}
//             invalidFeedback={formik.errors.visibility}
//             ariaLabel=""
//           >
//             <Option value="Public">Public</Option>
//             <Option value="Private">Private</Option>
//           </Select>
//         </FormGroup>

//         {/* Owner Selection */}
//         <FormGroup id="ownerId" label="Owner (search by name)" className="mb-3">
//           <div ref={userBoxRef}>
//             <Input
//               type="text"
//               placeholder="Search user..."
//               onFocus={() => setShowUserList(true)}
//               onChange={(e: any) => {
//                 setSearchTerm(e.target.value);
//                 setShowUserList(true);
//                 formik.setFieldTouched('ownerId', true);
//               }}
//               value={searchTerm}
//               className="mb-2"
//             />
//             {showUserList ? (
//               <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                 {isLoading ? (
//                   <div>Loading users...</div>
//                 ) : filteredUsers.length === 0 ? (
//                   <div className="text-muted">No user found</div>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <div
//                       key={user._id}
//                       className={`p-2 rounded mb-1 ${
//                         formik.values.ownerId === user._id ? 'bg-primary text-white' : 'hover:bg-light'
//                       }`}
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => {
//                         formik.setFieldValue('ownerId', user._id);
//                         setSearchTerm(user.fullName);
//                         setShowUserList(false);
//                       }}
//                     >
//                       {user.fullName}
//                     </div>
//                   ))
//                 )}
//               </div>
//             ) : null}
//             {formik.touched.ownerId && formik.errors.ownerId && (
//               <div className="text-danger mt-1">{formik.errors.ownerId}</div>
//             )}
//           </div>
//         </FormGroup>

//         {/* Members multi-select */}
//         <FormGroup id="members" label="Members (select multiple)" className="mb-3">
//           <div>
//             <Input
//               type="text"
//               placeholder="Search members..."
//               onChange={(e :any) => setSearchTerm(e.target.value)}
//               value={searchTerm}
//               className="mb-2"
//               onFocus={() => setShowUserList(true)}
//             />
//             <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//               {isLoading ? (
//                 <div>Loading users...</div>
//               ) : filteredUsers.length === 0 ? (
//                 <div className="text-muted">No user found</div>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <div
//                     key={user._id}
//                     className={`p-2 rounded mb-1 ${
//                       isUserSelected(user._id) ? 'bg-primary text-white' : 'hover:bg-light'
//                     }`}
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => toggleMember(user._id, user.fullName)}
//                   >
//                     {user.fullName}
//                   </div>
//                 ))
//               )}
//             </div>
//             {formik.touched.members && formik.errors.members && (
//               <div className="text-danger mt-1">{formik.errors.members}</div>
//             )}
//           </div>
//         </FormGroup>
//       </ModalBody>

//       <ModalFooter className="px-4 pb-4">
//         <Button color="secondary" onClick={() => setIsOpen(false)} className="me-2" isDisable={isSubmitting}>
//           Cancel
//         </Button>
//         <Button color="primary" onClick={() => formik.handleSubmit()} isDisable={isSubmitting}>
//           {editItem ? 'Update Thread' : 'Add Thread'} {isSubmitting && '...'}
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default ThreadAddModal;




import React, { FC, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';

import { useAddThreadMutation, useUpdateThreadMutation } from '../../../redux/api/thredApi';
import { fetchUsers } from '../../../redux/api/userApi';
import { RootState } from '../../../redux/store/store';

interface IThread {
	_id?: string;
	threadName: string;
	visibility: 'Public' | 'Private';
	description?: string;
	ownerId?: string;
	members?: string[];
}

interface IThreadAddModalProps {
	id: string;
	isOpen: boolean;
	editItem?: IThread;
	setIsOpen: (isOpen: boolean) => void;
	onSuccess?: () => void;
}

const ThreadAddModal: FC<IThreadAddModalProps> = ({
	id,
	isOpen,
	setIsOpen,
	editItem,
	onSuccess,
}) => {
	const [addThread] = useAddThreadMutation();
	const [updateThread] = useUpdateThreadMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [showUserList, setShowUserList] = useState(false);
	const userBoxRef = useRef<HTMLDivElement>(null);

	const user = useSelector((state: RootState) => state.auth.user);
	console.log('user', user);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchUsers();
				setAllUsers(data);
				setFilteredUsers(data);
			} catch (error) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Failed to load users</span>
					</span>,
					'Please try again later.',
				);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!searchTerm) {
			setFilteredUsers(allUsers);
		} else {
			setFilteredUsers(
				allUsers.filter((u) =>
					u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
				),
			);
		}
	}, [searchTerm, allUsers]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userBoxRef.current && !userBoxRef.current.contains(event.target as Node)) {
				setShowUserList(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const formik = useFormik({
		initialValues: {
			threadName: editItem?.threadName || '',
			visibility: editItem?.visibility || 'Public',
			description: editItem?.description || '',
			members: editItem?.members || [],
		},
		validationSchema: Yup.object({
			threadName: Yup.string()
				.required('Thread name is required')
				.min(3, 'Thread name must be at least 3 characters'),
			visibility: Yup.string()
				.required('Visibility is required')
				.oneOf(['Public', 'Private'], 'Invalid visibility option'),
			description: Yup.string().min(5, 'Description must be at least 5 characters'),
			members: Yup.array().min(1, 'Select at least one member').of(Yup.string()),
		}),
		enableReinitialize: true,
		onSubmit: async (values) => {
			setIsSubmitting(true);
			try {
				// Prepare payload
				const payload = {
					threadName: values.threadName,
					visibility: values.visibility,
					description: values.description,
					ownerId: user?.id || '',
					members: values.members.length ? [...values.members] : [],
				};

				if (editItem?._id) {
					await updateThread({ id: editItem._id, body: payload }).unwrap();
				} else {
					await addThread(payload).unwrap();
				}

				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='CheckCircle' size='lg' className='me-1' />
						<span>{editItem ? 'Thread Updated' : 'Thread Added'}</span>
					</span>,
					`${values.threadName} has been ${editItem ? 'updated' : 'added'} successfully.`,
				);

				formik.resetForm();
				setIsOpen(false);
				onSuccess?.();
			} catch (error) {
				console.error(error);
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error</span>
					</span>,
					`Failed to ${editItem ? 'update' : 'add'} thread. Please try again.`,
				);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	// Toggle member selection for multi-select
	const toggleMember = (id: string) => {
		const currentMembers = formik.values.members || [];
		if (currentMembers.includes(id)) {
			formik.setFieldValue(
				'members',
				currentMembers.filter((m) => m !== id),
			);
		} else {
			formik.setFieldValue('members', [...currentMembers, id]);
		}
	};

	if (!isOpen) return null;

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			size='md'
			titleId={id}
			isStaticBackdrop
			isCentered>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id={id}>{editItem ? 'Edit Thread' : 'Add New Thread'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				{/* Thread Name */}
				<FormGroup id='threadName' label='Thread Name' className='mb-3'>
					<Input
						id='threadName'
						name='threadName'
						placeholder='Enter thread name'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.threadName}
						isTouched={!!formik.touched.threadName}
						isValid={!formik.errors.threadName}
						invalidFeedback={formik.errors.threadName}
					/>
				</FormGroup>

				{/* Description */}
				<FormGroup id='description' label='Description' className='mb-3'>
					<Input
						id='description'
						name='description'
						placeholder='Enter description'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.description}
						isTouched={!!formik.touched.description}
						isValid={!formik.errors.description}
						invalidFeedback={formik.errors.description}
					/>
				</FormGroup>

				{/* Visibility */}
				<FormGroup id='visibility' label='Visibility' className='mb-3'>
					<Select
						id='visibility'
						name='visibility'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.visibility}
						isTouched={!!formik.touched.visibility}
						isValid={!formik.errors.visibility}
						invalidFeedback={formik.errors.visibility}
						ariaLabel=''>
						<Option value='Public'>Public</Option>
						<Option value='Private'>Private</Option>
					</Select>
				</FormGroup>

				{/* Members Multi-select */}

				<FormGroup id='members' label='Select Members' className='mb-3'>
					<div ref={userBoxRef}>
						<Input
							type='text'
							placeholder='Search user...'
							onFocus={() => setShowUserList(true)}
							onChange={(e: any) => {
								setSearchTerm(e.target.value);
								setShowUserList(true);
								formik.setFieldTouched('members', true);
							}}
							value={searchTerm}
							className='mb-2'
						/>

						{/* Selected users display */}
						<div className='mb-2 d-flex flex-wrap gap-2'>
							{formik.values.members?.map((memberId) => {
								const user = allUsers.find((u) => u._id === memberId);
								if (!user) return null;
								return (
									<div
										key={memberId}
										className='badge bg-primary d-flex align-items-center'
										style={{ cursor: 'default' }}>
										{user.fullName}
										<button
											type='button'
											className='btn-close btn-close-white btn-sm ms-2'
											aria-label='Remove'
											onClick={() => toggleMember(memberId)}
											style={{ cursor: 'pointer' }}></button>
									</div>
								);
							})}
						</div>

						{showUserList ? (
							<div
								className='border rounded p-2'
								style={{ maxHeight: '200px', overflowY: 'auto' }}>
								{filteredUsers.length === 0 ? (
									<div className='text-muted'>No user found</div>
								) : (
									filteredUsers.map((u) => (
										<div
											key={u._id}
											className={`p-2 rounded mb-1 ${
												formik.values.members?.includes(u._id)
													? 'bg-primary text-white'
													: 'hover:bg-light'
											}`}
											style={{ cursor: 'pointer' }}
											onClick={() => toggleMember(u._id)}>
											<input
												type='checkbox'
												checked={
													formik.values.members?.includes(u._id) || false
												}
												readOnly
												style={{ marginRight: '8px' }}
											/>
											{u.fullName}
										</div>
									))
								)}
							</div>
						) : null}
						{formik.touched.members && formik.errors.members && (
							<div className='text-danger mt-1'>{formik.errors.members}</div>
						)}
					</div>
				</FormGroup>
			</ModalBody>

			<ModalFooter className='px-4 pb-4'>
				<Button
					color='secondary'
					onClick={() => setIsOpen(false)}
					className='me-2'
					isDisable={isSubmitting}>
					Cancel
				</Button>
				<Button
					color='primary'
					onClick={() => formik.handleSubmit()}
					isDisable={isSubmitting}>
					{editItem ? 'Update Thread' : 'Add Thread'} {isSubmitting && '...'}
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default ThreadAddModal;
