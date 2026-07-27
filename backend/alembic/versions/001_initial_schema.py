"""Initial PostgreSQL schema migration

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-07-26 19:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Users Table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('USER', 'PRO', 'ADMIN', name='userrole'), nullable=False, server_default='USER'),
        sa.Column('avatar_url', sa.String(length=512), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('is_verified', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('free_credits_used', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_role', 'users', ['role'], unique=False)
    op.create_index('ix_users_created_at', 'users', ['created_at'], unique=False)

    # 2. Subscriptions Table
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('stripe_customer_id', sa.String(length=255), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(length=255), nullable=True),
        sa.Column('plan', sa.Enum('FREE', 'PRO_MONTHLY', 'PRO_YEARLY', 'ENTERPRISE', name='subscriptionplan'), nullable=False, server_default='FREE'),
        sa.Column('status', sa.Enum('ACTIVE', 'CANCELED', 'PAST_DUE', 'EXPIRED', name='subscriptionstatus'), nullable=False, server_default='ACTIVE'),
        sa.Column('current_period_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancel_at_period_end', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index('ix_subscriptions_id', 'subscriptions', ['id'], unique=False)
    op.create_index('ix_subscriptions_user_id', 'subscriptions', ['user_id'], unique=True)
    op.create_index('ix_subscriptions_plan', 'subscriptions', ['plan'], unique=False)
    op.create_index('ix_subscriptions_status', 'subscriptions', ['status'], unique=False)
    op.create_index('ix_subscriptions_created_at', 'subscriptions', ['created_at'], unique=False)

    # 3. Conversion History Table
    op.create_table(
        'conversion_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('source_language', sa.String(length=50), nullable=False),
        sa.Column('target_language', sa.String(length=50), nullable=False),
        sa.Column('model_used', sa.String(length=100), nullable=False),
        sa.Column('source_code', sa.Text(), nullable=False),
        sa.Column('target_code', sa.Text(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('execution_time_ms', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('code_size_bytes', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('tokens_used', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_conversion_history_id', 'conversion_history', ['id'], unique=False)
    op.create_index('ix_conversion_history_user_id', 'conversion_history', ['user_id'], unique=False)
    op.create_index('ix_conversion_history_source_language', 'conversion_history', ['source_language'], unique=False)
    op.create_index('ix_conversion_history_target_language', 'conversion_history', ['target_language'], unique=False)
    op.create_index('ix_conversion_history_model_used', 'conversion_history', ['model_used'], unique=False)
    op.create_index('ix_conversion_history_created_at', 'conversion_history', ['created_at'], unique=False)

    # 4. Api Usage Table
    op.create_table(
        'api_usage',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('endpoint', sa.String(length=100), nullable=False),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('prompt_tokens', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('completion_tokens', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('estimated_cost_usd', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('latency_ms', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_api_usage_id', 'api_usage', ['id'], unique=False)
    op.create_index('ix_api_usage_user_id', 'api_usage', ['user_id'], unique=False)
    op.create_index('ix_api_usage_endpoint', 'api_usage', ['endpoint'], unique=False)
    op.create_index('ix_api_usage_model', 'api_usage', ['model'], unique=False)
    op.create_index('ix_api_usage_created_at', 'api_usage', ['created_at'], unique=False)

def downgrade() -> None:
    op.drop_table('api_usage')
    op.drop_table('conversion_history')
    op.drop_table('subscriptions')
    op.drop_table('users')
    sa.Enum(name='subscriptionstatus').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='subscriptionplan').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='userrole').drop(op.get_bind(), checkfirst=True)
