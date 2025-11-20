import OwnerForm from '@/app/components/OwnerForm';
import OwnerList from '@/app/components/OwnerList';

export default function OwnersPage() {
    return (
        <div>
            <OwnerForm />
            <hr />
            <OwnerList />
        </div>
    );
}