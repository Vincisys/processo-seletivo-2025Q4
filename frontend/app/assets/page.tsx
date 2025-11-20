import AssetForm from '@/app/components/AssetForm';
import AssetList from '@/app/components/AssetList';

export default function AssetsPage() {
    return (
        <div>
            <AssetForm />
            <hr />
            <AssetList />
        </div>
    );
}